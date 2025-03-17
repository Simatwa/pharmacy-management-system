from django.contrib import admin
from pharmacy.models import Medicine, Order, Inventory, Payment
from pharmacy.forms import OrderForm
from django.utils.html import format_html


# Register your models here.
@admin.register(Medicine)
class MedicineAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price", "stock", "created_at", "updated_at")
    search_fields = ("name", "category")
    list_filter = ("category", "name", "stock", "price", "created_at")
    ordering = ("-created_at",)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    form = OrderForm
    list_display = (
        "customer",
        "medicine",
        "quantity",
        "total_price",
        "status",
        "created_at",
        "updated_at",
    )
    search_fields = ("customer__username", "medicine__name", "status")
    list_filter = ("status", "medicine", "customer", "created_at")
    ordering = ("-created_at",)

    def status_colored(self, obj):
        status = obj.status.title()
        color = {"Pending": "orange", "Processed": "blue", "Delivered": "green"}.get(
            status, "black"
        )

        return format_html('<span style="color: {};">{}</span>', color, status)

    status_colored.short_description = "Status"

    list_display = (
        "customer",
        "medicine",
        "quantity",
        "total_price",
        "status_colored",
        "created_at",
        "updated_at",
    )


@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = ("medicine", "change", "reason", "timestamp")
    search_fields = ("medicine", "reason")
    list_filter = (
        "medicine",
        "reason",
        "timestamp",
    )
    ordering = ("-timestamp",)


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("amount", "method", "reference", "created_at", "updated_at")
    search_fields = ("reference", "method")
    list_filter = ("method", "created_at")
    ordering = ("-created_at",)
