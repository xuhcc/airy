class UnitError(Exception):

    def __init__(self, message, status_code=200):
        super().__init__()
        self.message = message
        self.status_code = status_code


class UserError(UnitError):
    pass


class ClientError(UnitError):
    pass


class ProjectError(UnitError):
    pass


class TaskError(UnitError):
    pass


class TimeEntryError(UnitError):
    pass
