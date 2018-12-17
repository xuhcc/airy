import './header.module.js';

describe('airyBreadcrumbs service', () => {
    'use strict';

    let stateMock;
    let transitionsMock;
    let breadcrumbs;

    beforeEach(() => {
        module('airy.header', ($provide) => {
            stateMock = jasmine.createSpyObj('state', ['href']);
            $provide.value('$state', stateMock);
            transitionsMock = jasmine.createSpyObj('transitions', ['onSuccess']);
            $provide.value('$transitions', transitionsMock);
        });
        inject((_airyBreadcrumbs_) => {
            breadcrumbs = _airyBreadcrumbs_;
        });
    });

    it('should initialize service', () => {
        expect(stateMock.href).toHaveBeenCalledWith('client_list');
        expect(transitionsMock.onSuccess).toHaveBeenCalled();
        expect(breadcrumbs.steps.length).toBe(1);
        expect(breadcrumbs.add).toBeDefined();
    });

    it('should add breadcrumbs', () => {
        breadcrumbs.add({label: 'test1'}, {label: 'test2'});
        expect(breadcrumbs.steps.length).toBe(3);
    });
});
