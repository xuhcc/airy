import TaskCreationController from 'tasks/task_form.creation.controller.js';
import TaskUpdateController from 'tasks/task_form.update.controller.js';

export default angular.module('airy.taskForm', [])
    .controller('TaskCreationController', TaskCreationController)
    .controller('TaskUpdateController', TaskUpdateController);
