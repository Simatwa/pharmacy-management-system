from django.db import models
from users.models import CustomUser
from pharmacy.exceptions import InsufficientBalanceError, PharmacyException


# Create your models here.
from django.utils.translation import gettext_lazy as _

from os import path
from enum import Enum
from django.contrib import messages

# Create your models here.


def generate_document_filepath(instance: "Medicine", filename: str) -> str:
    filename, extension = path.splitext(filename)
    return f"{instance.__class__.__name__.lower()}/{filename}_{instance.id}{extension}"


class Medicine(models.Model):

    class MedicineCategory(str, Enum):
        TABLET = "Tablet"
        SYRUP = "Syrup"
        INJECTION = "Injection"
        OINTMENT = "Ointment"
        OTHER = "Other"

        @classmethod
        def choices(cls):
            return [(key.name, key.value) for key in cls]

    name = models.CharField(
        max_length=255,
        verbose_name=_("Medicine Name"),
        help_text=_("Full name of the medicine"),
        unique=True,
    )
    short_name = models.CharField(
        max_length=20,
        null=True,
        blank=True,
        verbose_name=_("Abbreviated name"),
        help_text=_("Abbreviated name for the medicine"),
        unique=True,
    )
    category = models.CharField(
        max_length=50,
        choices=MedicineCategory.choices(),
        verbose_name=_("Category"),
        help_text=_("Select the category of the medicine"),
    )
    description = models.TextField(
        verbose_name=_("Description"),
        help_text=_("Provide a detailed description of the medicine"),
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name=_("Price in Ksh"),
        help_text=_("Enter the price of the medicine in Kenyan Shillings"),
    )
    stock = models.PositiveIntegerField(
        verbose_name=_("Stock Level"),
        help_text=_("Enter the current stock level of the medicine"),
    )
    picture = models.ImageField(
        upload_to=generate_document_filepath,
        default="default/ai-generated-medicine.jpg",
        verbose_name=_("Photo of the medicine"),
        help_text=_("Upload a photo of the medicine"),
        blank=True,
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_("Created At"),
        help_text=_("The date and time when the medicine was created"),
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_("Updated At"),
        help_text=_("The date and time when the medicine was last updated"),
    )

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        change = 0
        if self.id:  # Update to existing one
            original = Medicine.objects.get(pk=self.pk)
            if original.stock != self.stock:
                change = self.stock - original.stock
                reason = Inventory.ChangeReason.STOCK_UPDATE.value
        else:  # New entry
            change = self.stock
            reason = Inventory.ChangeReason.INITIAL_STOCK.value
        super().save(*args, **kwargs)
        if change:
            Inventory.objects.create(
                medicine=self,
                change=change,
                reason=reason,
            ).save()


class Order(models.Model):

    class OrderStatus(Enum):
        PENDING = "Pending"
        PROCESSED = "Processed"
        DELIVERED = "Delivered"

        @classmethod
        def choices(cls):
            return [(key.name, key.value) for key in cls]

    customer = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        verbose_name=_("Customer"),
        help_text=_("Select the customer who placed the order"),
        related_name="orders",
    )
    medicine = models.ForeignKey(
        Medicine,
        on_delete=models.CASCADE,
        verbose_name=_("Medicine"),
        help_text=_("Select the medicine being ordered"),
    )
    quantity = models.PositiveIntegerField(
        verbose_name=_("Quantity"),
        help_text=_("Enter the quantity of medicine ordered"),
    )
    prescription = models.TextField(
        null=False, blank=False, help_text=_("Enter the prescription details")
    )
    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name=_("Total Price"),
        help_text=_("Enter the total price of the order"),
        blank=True,
        null=True,
    )
    status = models.CharField(
        max_length=50,
        choices=OrderStatus.choices(),
        default=OrderStatus.PENDING.value,
        verbose_name=_("Status"),
        help_text=_("Select the current status of the order"),
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_("Created At"),
        help_text=_("The date and time when the order was created"),
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_("Updated At"),
        help_text=_("The date and time when the order was last updated"),
    )

    def save(self, *args, **kwargs):
        if self.medicine.stock < self.quantity:
            raise ValueError("Not enough stock available for the requested quantity.")
        self.total_price = self.medicine.price * self.quantity
        if not self.id:  # new
            if self.customer.account.balance < self.total_price:
                raise InsufficientBalanceError(
                    f"Customer's account balance is less by Ksh.{self.total_price -self.customer.account.balance} "
                    "to place this order"
                )
            self.medicine.stock -= self.quantity
            self.medicine.save()
            Inventory.objects.create(
                medicine=self.medicine,
                change=-self.quantity,
                reason=Inventory.ChangeReason.INITIAL_SALE.value,
            ).save()
            self.customer.account.balance -= self.total_price
            self.customer.account.save()
        else:  # update
            original = Order.objects.get(pk=self.pk)
            if original.quantity != self.quantity:
                change = original.quantity - self.quantity
                self.medicine.stock += change
                self.medicine.save()
                payment_made = original.total_price
                new_payment_required = self.total_price
                change = new_payment_required - payment_made
                if change > 0:
                    # Customer needs to pay more
                    if change > self.customer.account.balance:
                        raise InsufficientBalanceError(
                            f"Customer's account balance is less by Ksh.{self.total_price - self.customer.account.balance} "
                            "to place this order"
                        )
                    else:
                        self.customer.account.balance -= change
                else:
                    # Refund customer
                    self.customer.account.balance -= change  # -- results to +

                self.customer.account.save()
                Inventory.objects.create(
                    medicine=self.medicine,
                    change=change,
                    reason=Inventory.ChangeReason.ORDER_QUANTITY_UPDATE.value,
                ).save()
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        if self.status != self.OrderStatus.DELIVERED.value:
            self.customer.account.balance += self.total_price
            self.customer.account.save()
            Inventory.objects.create(
                medicine=self.medicine,
                change=self.quantity,
                reason=Inventory.ChangeReason.ORDER_QUANTITY_UPDATE.value,
            ).save()
        super().delete(*args, **kwargs)

    def __str__(self):
        return f"Order {self.id} by {self.customer.username}"


class Inventory(models.Model):

    class ChangeReason(Enum):
        INITIAL_STOCK = "Initial stock"
        STOCK_UPDATE = "Stock update"
        INITIAL_SALE = "Initial sale"
        ORDER_QUANTITY_UPDATE = "Order quantity update"

        @classmethod
        def choices(cls):
            return [(key.value, key.name) for key in cls]

    medicine = models.ForeignKey(
        Medicine,
        on_delete=models.CASCADE,
        verbose_name=_("Medicine"),
        help_text=_("Select the medicine for which the inventory change is logged"),
    )
    change = models.IntegerField(
        verbose_name=_("Change in Stock"),
        help_text=_("Enter the change in stock level"),
    )

    reason = models.CharField(
        max_length=50,
        choices=ChangeReason.choices(),
        default=ChangeReason.INITIAL_STOCK.value,
        verbose_name=_("Reason"),
        help_text=_("Select reason for change"),
        null=False,
        blank=False,
    )
    timestamp = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_("Timestamp"),
        help_text=_("The date and time when the inventory change was logged"),
    )

    def __str__(self):
        return f"Inventory change for {self.medicine.name} at {self.timestamp.strftime('%d-%b-%Y %H:%M:%S')}"

    class Meta:
        verbose_name_plural = _("Inventories")
