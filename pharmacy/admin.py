from django.contrib import admin
from pharmacy.models import Medicine, Order, Inventory
from pharmacy.forms import OrderForm
from django.utils.html import format_html


# Register your models here.
@admin.register(Medicine)
class MedicineAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "short_name",
        "category",
        "price",
        "stock",
        "updated_at",
        "created_at",
    )
    search_fields = ("name", "short_name", "category")
    list_filter = ("category", "name", "stock", "price", "created_at")
    ordering = ("-created_at",)
    list_editable= ("stock", )

    fieldsets = (
        (
            None,
            {"fields": ("name", "short_name", "category", "description", "picture")},
        ),
        ("Stock & Price", {"fields": ("stock", "price")}),
    )


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
    fieldsets = (
        (None, {"fields": ("customer",)}),
        ("Details", {"fields": ("medicine", "quantity", "prescription")}),
        (
            "Delivery",
            {
                "fields": ("status",),
            },
        ),
    )

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
        "medicine__stock",
        "reason",
        "timestamp",
    )
    ordering = ("-timestamp",)
