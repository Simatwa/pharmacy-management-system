from django import forms
from pharmacy.models import Order, Medicine, Payment


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
        return quantity

    def clean_payment(self):
        medicine: Medicine = self.cleaned_data.get("medicine")
        quantity: int = self.cleaned_data.get("quantity")
        order_price = medicine.price * quantity
        transaction: Payment = self.cleaned_data.get("payment")
        if transaction.amount < order_price:
            raise forms.ValidationError(
                f"Payment is less than the order price by {order_price - transaction.amount}."
            )
