SCHEMA_ERROR_KEY = '_schema'


class ApiError(Exception):

    def __init__(self, errors, status_code=400):
        super().__init__()
        if isinstance(errors, str):
            self.message = errors
        elif isinstance(errors, dict):
            self.message = self.errors_to_string(errors)
        else:
            raise AssertionError
        self.status_code = status_code

    def errors_to_string(self, err_dict):
        messages = []
        if SCHEMA_ERROR_KEY in err_dict:
            messages.append(', '.join(err_dict.pop(SCHEMA_ERROR_KEY)))
        for field_name, err_list in err_dict.items():
            messages.append('{0}: {1}'.format(field_name.capitalize(),
                                              ', '.join(err_list)))
        return '\n'.join(messages)


class UserError(ApiError):
    pass


class ClientError(ApiError):
    pass


class ProjectError(ApiError):
    pass


class TaskError(ApiError):
    pass


class TimeEntryError(ApiError):
    pass
