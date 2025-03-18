from django import forms
from users.models import CustomUser


class CustomUserCreationForm(forms.ModelForm):
    password = forms.PasswordInput()

    class Meta:
        model = CustomUser
        fields = [
            "username",
            "email",
            "password",
        ]


class CustomUserUpdateForm(forms.ModelForm):
    password = forms.PasswordInput()

    class Meta:
        model = CustomUser
        fields = [
            "first_name",
            "username",
            "email",
            "password",
            "gender",
            "last_name",
            "profile",
        ]
