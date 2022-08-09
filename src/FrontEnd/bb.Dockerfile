# to use this you need to have an api token from github
# the API token also needs access to partner repos, which requires SRE/CCS

# docker build . -f bb.Dockerfile --build-arg GITHUB_TOKEN=[YOUR_API_TOKEN] --build-arg NUMBER_TO_BUILD=2 --tag bb
# docker create --name get-output bb
# docker cp get-output:/output .
# docker rm get-output

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

RUN apt-get update && \
  apt-get install curl gnupg -yq && \
  curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
  apt-get install -y nodejs && \
  apt-get install openssh-client -yq

RUN dotnet tool install -g beacon

WORKDIR /src/insite-commerce

ARG GITHUB_TOKEN
ENV GITHUB_TOKEN=$GITHUB_TOKEN

RUN git config --global url."https://api:$GITHUB_TOKEN@github.com/".insteadOf "https://github.com/"
RUN git config --global url."https://ssh:$GITHUB_TOKEN@github.com/".insteadOf "ssh://git@github.com/"
RUN git config --global url."https://ssh:$GITHUB_TOKEN@github.com/".insteadOf "ssh://git@github.com/"

COPY ./episerver-platform-navigation-v0.8.7-rebrand-v2.tgz ./package.json ./package-lock.json ./validateLockFile.js ./
# spire linter needs to exist on disk when we use npm ci
COPY ./modules/spire-linter ./modules/spire-linter

RUN ["npm", "ci", "--unsafe-perm"]

COPY ./babel.config.js ./constants.d.ts ./tsconfig.base.json ./
COPY ./config/spire_routes.json ./config/
COPY ./config/webpack/ ./config/webpack/
RUN ["npm", "run", "setupTsconfigPaths"]

COPY ./modules/ ./modules/

WORKDIR /src/insite-commerce/blueprintBuilder

COPY ./blueprintBuilder/ ./

RUN /root/.dotnet/tools/dotnet-beacon -- -d >> clientProjects.json

RUN git config --global url."https://git:$GITHUB_TOKEN@github.com/".insteadOf "git@github-work-clients:"

ARG NUMBER_TO_BUILD
ENV NUMBER_TO_BUILD=$NUMBER_TO_BUILD

RUN ["node", "index.js", "1"]

FROM "alpine" AS output

WORKDIR /output
COPY --from=build /src/insite-commerce/blueprintBuilder/output ./