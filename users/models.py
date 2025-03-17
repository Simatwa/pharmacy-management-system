from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext as _
from uuid import uuid4
from os import path
from django.core.validators import FileExtensionValidator

# Create your models here.


def generate_profile_filepath(instance: "CustomUser", filename: str) -> str:
    custom_filename = str(uuid4()) + path.splitext(filename)[1]
    return f"user_profile/{instance.id}{custom_filename}"


class CustomUser(AbstractUser):
    """Both indiduals and organizations"""

    gender = models.CharField(
        verbose_name=_("gender"),
        max_length=10,
        help_text=_("Select one"),
        choices=(
            ["M", "Male"],
            ["F", "Female"],
            ["O", "Other"],
        ),
        blank=True,
        default="O",
    )

    role = models.CharField(
        verbose_name=_("role"),
        help_text=_("Select one"),
        choices=(["Student", "Student"], ["Teacher", "Teacher"], ["Admin", "Admin"]),
        default="Admin",
        max_length=30,
    )

    profile = models.ImageField(
        _("Profile Picture"),
        default="default/user.png",
        upload_to=generate_profile_filepath,
        validators=[FileExtensionValidator(allowed_extensions=["jpg", "jpeg", "png"])],
        blank=True,
        null=True,
    )

    token = models.CharField(
        _("token"),
        help_text=_("Token for validation"),
        null=True,
        blank=True,
        max_length=40,
        unique=True,
    )

    class Meta:
        verbose_name = _("user")
        verbose_name_plural = _("users")
