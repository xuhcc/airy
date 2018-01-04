function airyBreadcrumbs($state, $transitions) {
    const home = {
        url: $state.href('client_list'),
        label: 'h',
    };
    let service = {
        steps: [home],
        add: add,
    };
    $transitions.onSuccess({}, (transition) => {
        // Reset on transition
        service.steps = [home];
    });
    return service;

    function add(...items) {
        service.steps = [home];
        items.forEach((item) => {
            let url;
            if (item.state) {
                url = $state.href(item.state, item.params || {});
            }
            service.steps.push({
                url: url,
                label: item.label,
            });
        });
    }
}

export default airyBreadcrumbs;
