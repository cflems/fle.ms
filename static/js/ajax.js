(function () {
    const btn = document.querySelector('#shortenButton');
    const inpUrl = document.querySelector('#url');
    const inpSlug = document.querySelector('#slug');

    function uiError (message) {
        btn.textContent = message;
        btn.classList.add('error');
        inpUrl.addEventListener('input', resetState);
        inpSlug.addEventListener('input', resetState);
    }

    function shorten (e) {
        if (!inpUrl.value) return;

        const req = new XMLHttpRequest();
        req.addEventListener('load', () => {
            const reply = JSON.parse(req.responseText);
            if (req.status != 201) {
                console.error(req.status, reply.errorMessage);
                uiError(reply.uiString || 'API Error');
                return;
            }

            inpUrl.value = reply.data.shortUrl;
            btn.removeEventListener('click', shorten);
            btn.classList.remove('error');
            btn.textContent = 'Copy';
            btn.addEventListener('click', copyUrl);
            inpUrl.addEventListener('input', resetState);
            inpSlug.addEventListener('input', resetState);
            inpUrl.focus();
            inpUrl.select();
        });
        req.addEventListener('error', () => uiError('Connection Error'));

        if (inpSlug.value)
            req.open('PUT', '/'+encodeURIComponent(inpSlug.value));
        else
            req.open('POST', '/');
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify({url: encodeURI(inpUrl.value)}));
    }

    async function copyUrl(e) {
        await navigator.clipboard.writeText(encodeURI(inpUrl.value));
        btn.textContent = 'Copied!';
    }

    function resetState () {
        inpUrl.removeEventListener('input', resetState);
        inpSlug.removeEventListener('input', resetState);
        btn.removeEventListener('click', copyUrl);
        btn.classList.remove('error');
        btn.textContent = 'Shorten URL';
        btn.addEventListener('click', shorten);
    }

    btn.addEventListener('click', shorten);
})();