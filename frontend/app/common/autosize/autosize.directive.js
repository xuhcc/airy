/* global autosize */

export function autoSize($timeout) {
    function link(scope, element) {
        let textarea = element[0];
        if (textarea.nodeName !== 'TEXTAREA') {
            return;
        }
        // http://www.jacklmoore.com/autosize/#faq-hidden
        $timeout(function () {
            autosize(element);
        }, 10);
    }
    return {
        restrict: 'A',
        link: link,
    };
}
