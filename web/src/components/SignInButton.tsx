import { useSignIn } from '@solana/react';

export function SignInButton({ wallet }) {
  const csrfToken = useCsrfToken();
  const signIn = useSignIn(wallet);
  return (
    <button
      onClick={async () => {
        try {
          const { account, signedMessage, signature } = await signIn({
            requestId: csrfToken,
          });
          // Authenticate the user, typically on the server, by verifying that
          // `signedMessage` was signed by the person who holds the private key for
          // `account.publicKey`.
          //
          // Authorize the user, also on the server, by decoding `signedMessage` as the
          // text of a Sign In With Solana message, verifying that it was not modified
          // from the values your application expects, and that its content is sufficient
          // to grant them access.
          window.alert(`You are now signed in with the address ${account.address}`);
        } catch (thrownObject) {
          const error = thrownObject as Error;
          console.error('Failed to sign in', error.message);
        }
      }}
    >
      Sign In
    </button>
  );
}