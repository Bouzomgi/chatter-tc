# Chatter Traffic Controller

I'd like to break up the nginx config into a couple pieces:

1. Base config
2. Routes for backend
3. Routes for frontend

To start, I will only implement backend, but I'll make sure things extend cleanly for when I get to frontend implementation.

I will keep "microServer" for now as well.

GOALS:

1. Spin up just backend red (microserver) using an nginx config split
2. Introduce Jinja and implement red-black
3. Swap out microserver -> chatter-be
4. Repeat with chatter-fe
