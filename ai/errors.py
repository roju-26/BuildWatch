"""Exceptions raised by the BuildWatch AI module.
The backend can catch AIModuleError to handle every AI failure in one place."""


class AIModuleError(Exception):
    """Base class for all AI-module errors."""


class ImageLoadError(AIModuleError):
    """Image file is missing, empty or cannot be decoded."""


class ModelNotFoundError(AIModuleError):
    """YOLO weights file was not found at AI_MODEL_PATH."""