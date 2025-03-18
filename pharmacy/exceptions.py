class PharmacyException(Exception):
    """Base class for pharmacy exceptions"""


class InsufficientBalanceError(PharmacyException):
    """Raised when placing order while customer
    does not have enough funds"""
