FROM denoland/deno:alpine-1.43.2

EXPOSE 8080

WORKDIR /app

RUN mkdir -p /workspaces/ && chown -R deno:deno /workspaces

USER deno

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
# COPY deps.ts .
# RUN deno cache deps.ts

# These steps will be re-run upon each file change in your working directory:
COPY ./backend .

# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache mod.ts

VOLUME /workspaces/

CMD ["run", "--allow-all", "--unstable-worker-options", "mod.ts"]
