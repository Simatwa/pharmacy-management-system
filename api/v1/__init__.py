"""V1 implementation of Assignment-MS
"""

from api.v1.routes import router
from api.v1.teacher.routes import router as teacher_router
from api.v1.student.routes import router as student_router

router.include_router(teacher_router)
router.include_router(student_router)
