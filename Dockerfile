FROM denoland/deno:1.43.4

EXPOSE 8080

WORKDIR /app

USER deno

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
# COPY deps.ts .
# RUN deno cache deps.ts

# These steps will be re-run upon each file change in your working directory:
COPY ./src .

# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache mod.ts

CMD ["run", "--allow-all", "mod.ts"]
