(function () {
    const btn = document.querySelector('#shortenButton');
    const inpUrl = document.querySelector('#url');
    const inpSlug = document.querySelector('#slug');

    function shorten (e) {
        if (!inpUrl.value) return;

        const req = new XMLHttpRequest();
        req.addEventListener('load', () => {
            const reply = JSON.parse(req.responseText);
            if (req.status != 201) {
                btn.innerText = reply.uiString || 'API Error';
                btn.classList.add('error');
                console.error(req.status, reply.errorMessage);
                return;
            }

            inpUrl.value = reply.data.shortUrl;
            inpSlug.value = '';
            btn.removeEventListener('click', shorten);
            btn.classList.remove('error');
            btn.innerText = 'Copy';
            btn.addEventListener('click', copyUrl);
            inpUrl.focus();
            inpUrl.select();
        });
        req.addEventListener('error', () => {
            btn.innerText = 'Connection Error';
            btn.classList.add('error');
        })

        if (inpSlug.value)
            req.open('PUT', '/'+encodeURIComponent(inpSlug.value));
        else
            req.open('POST', '/');
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify({url: encodeURI(inpUrl.value)}));
    }

    async function copyUrl(e) {
        await navigator.clipboard.writeText(encodeURI(inpUrl.value));
        btn.innerText = 'Copied!';
    }

    btn.addEventListener('click', shorten);
})();