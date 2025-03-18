from django import forms
from pharmacy.models import Order, Medicine
from users.models import CustomUser


class OrderForm(forms.ModelForm):
    class Meta:
        model = Order
        exclude = ["total_price", "created_at", "updated_at"]

    def clean_quantity(self):
        quantity = self.cleaned_data.get("quantity")
        medicine: Medicine = self.cleaned_data.get("medicine")

        if quantity < 1:
            raise forms.ValidationError("Quantity must be at least 1.")

        if medicine and quantity > medicine.stock:
            raise forms.ValidationError(
                "Not enough stock available for the requested quantity. "
                f"Available quantity {medicine.stock}."
            )
        user: CustomUser = self.cleaned_data.get("customer")
        total_price = medicine.price * quantity
        if user.account.balance < total_price:
            raise forms.ValidationError(
                f"Customer's account balance is less by Ksh.{total_price - user.account.balance} "
                "to place this order."
            )
        return quantity
