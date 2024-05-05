import { OidcProvider } from "@axa-fr/react-oidc";
import { useRouter } from "next/router";
import React, { PropsWithChildren } from "react";
import { Loader } from "./Loader/Loader";
import { Error } from "./Error";
import { FullScreenContainer } from "./FullScreenContainer";

const configuration = {
  client_id: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID as string,
  redirect_uri:
    process.env.NEXT_PUBLIC_FRONTEND_URL + "/#authentication/callback",
  silent_redirect_uri:
    process.env.NEXT_PUBLIC_FRONTEND_URL + "/#authentication/silent-callback", // Optional activate silent-signin that use cookies between OIDC server and client javascript to restore the session
  scope: process.env.NEXT_PUBLIC_OIDC_SCOPES as string,
  authority: process.env.NEXT_PUBLIC_OIDC_AUTHORITY as string,
};

const onEvent = (configurationName: string, eventName: string, data: any) => {
  // eslint-disable-next-line no-undef
  console.log(`oidc:${configurationName}:${eventName}`, data);
};

export interface LayoutProps extends PropsWithChildren {}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const withCustomHistory = () => {
    return {
      replaceState: (url: string) => {
        router
          .replace({
            pathname: url,
          })
          .then(() => {
            // eslint-disable-next-line no-undef
            window.dispatchEvent(new Event("popstate"));
          });
      },
    };
  };
  return (
    <>
      <OidcProvider
        callbackSuccessComponent={() => null}
        sessionLostComponent={() => (
          <FullScreenContainer>
            <Error
              label="409 error"
              description="Session lost"
              message="Sorry, it seems you have been disconnected, please signin again."
            />
          </FullScreenContainer>
        )}
        authenticatingComponent={() => (
          <FullScreenContainer>
            <Loader />
          </FullScreenContainer>
        )}
        authenticatingErrorComponent={() => (
          <FullScreenContainer>
            <Error
              label="409 error"
              description="Authenticating error."
              message="Sorry, an unexpected error has occured while authenticating you to our servers, please wait a bit and retry."
            />
          </FullScreenContainer>
        )}
        loadingComponent={() => (
          <FullScreenContainer>
            <Loader />
          </FullScreenContainer>
        )}
        serviceWorkerNotSupportedComponent={() => (
          <FullScreenContainer>
            <Error
              label="409 error"
              description="Service Worker not supported."
              message="Sorry, it seems your browser does not support service workers, please update it before retrying accessing the platform"
            />
          </FullScreenContainer>
        )}
        configuration={configuration}
        onEvent={onEvent}
        withCustomHistory={withCustomHistory}
      >
        <main>{children}</main>
      </OidcProvider>
    </>
  );
}
