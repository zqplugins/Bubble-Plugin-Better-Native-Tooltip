function () {
    document.addEventListener('DOMContentLoaded', function() {
        function initializeTippy(element, content, position = 'top', animation = 'shift-away') {
            if (element._tippy) {
                element._tippy.setContent(content);
                element._tippy.setProps({
                    placement: position,
                    animation: animation
                });
            } else {
                tippy(element, {
                    theme: "_*_Theme_*_",
                    content: content,
                    placement: position,
                    animation: animation,
                    allowHTML: true
                });
            }
        }

        function applyTooltip(element) {
            if (element.hasAttribute('title') && element.getAttribute('title').trim() !== '') {
                const titleContent = element.getAttribute('title').trim();
                const configPattern = /^\[(.*?)\](.*)/;
                const match = titleContent.match(configPattern);

                if (match) {
                    const [_, config, text] = match;
                    const configs = config.split(',').map(c => c.trim());
                    const position = configs[0];
                    const animation = (configs[1] === 'no-animation') ? false : 'shift-away';

                    initializeTippy(element, text.trim(), position, animation);
                } else {
                    initializeTippy(element, titleContent);
                }

                element.removeAttribute('title');
            }
        }

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'title' && mutation.target.nodeType === Node.ELEMENT_NODE) {
                    applyTooltip(mutation.target);
                }
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        applyTooltip(node);
                        node.querySelectorAll('[title]').forEach(applyTooltip);
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['title'] });

        document.querySelectorAll('[title]').forEach(applyTooltip);
    });
}