import 'common/header/header.module.js';

describe('airyBreadcrumbs service', function () {
    'use strict';

    let stateMock;
    let transitionsMock;
    let breadcrumbs;

    beforeEach(function () {
        module('airy.header', function ($provide) {
            stateMock = jasmine.createSpyObj('state', ['href']);
            $provide.value('$state', stateMock);
            transitionsMock = jasmine.createSpyObj('transitions', ['onSuccess']);
            $provide.value('$transitions', transitionsMock);
        });
        inject(function (_airyBreadcrumbs_) {
            breadcrumbs = _airyBreadcrumbs_;
        });
    });

    it('should initialize service', function () {
        expect(stateMock.href).toHaveBeenCalledWith('client_list');
        expect(transitionsMock.onSuccess).toHaveBeenCalled();
        expect(breadcrumbs.steps.length).toBe(1);
        expect(breadcrumbs.add).toBeDefined();
    });
});
