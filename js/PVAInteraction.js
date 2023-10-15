const driver = window.driver.js.driver({
    popoverClass: "driverjs-theme",
    stagePadding: 4,
    smoothScroll: true
});

function highlightElement(e) {
    driver.highlight({
        element: "#" + e.element,
        popover: {
            title: e.title,
            description: e.description,
        }
    })
}

function addCart(e) {
    var myModal = new bootstrap.Modal(document.getElementById('cartModal'), { keyboard: false });
    myModal.show();
}

window.onload = function() {
    var botEndpoint = "https://LINK TO YOUR PVA APP";

    const store = window.WebChat.createStore({},
        ({ dispatch }) => next => action => {
            if (action.type === "DIRECT_LINE/CONNECT_FULFILLED") {
                var dispatchJSON = {
                    meta: {
                        method: "keyboard",
                    },
                    payload: {
                        activity: {
                            channelData: {
                                postBack: true,
                            },
                            name: 'startConversation',
                            type: "event",
                        },
                    },
                    type: "DIRECT_LINE/POST_ACTIVITY",
                }
                dispatch(dispatchJSON);
            } else if (action.type === "DIRECT_LINE/INCOMING_ACTIVITY" && action.payload?.activity?.type === "event") {
                switch(action.payload?.activity?.name)
                {
                    case 'ShowElement':
                        highlightElement(action.payload?.activity?.value);
                        break;

                    case 'AddCart':
                        addCart(action.payload?.activity?.value);
                        break;
                }
            }
            return next(action);
        }
    );

    fetch(botEndpoint)
        .then(response => response.json())
        .then(conversationInfo => {
            window.WebChat.renderWebChat({
                    directLine: window.WebChat.createDirectLine({
                        token: conversationInfo.token,
                    }),
                    store: store,
                    styleOptions: styleOptions = {
                        hideUploadButton: true
                    }
                },
                document.getElementById('webchat')
            );
        })
        .catch(err => console.error("An error occurred: " + err));
}