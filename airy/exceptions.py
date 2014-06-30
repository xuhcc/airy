class UnitError(Exception):

    def __init__(self, message, code=500):
        super().__init__()
        self.message = message
        self.code = code
        logger.warning(message)


class ClientError(UnitError):
    pass


class ProjectError(UnitError):
    pass


class TaskError(UnitError):
    pass


class TimeEntryError(UnitError):
    pass
