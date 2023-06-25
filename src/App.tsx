import HelpScout, { NOTIFICATION_TYPES } from "@helpscout/javascript-sdk";
import { Button, DefaultStyle, Heading } from "@helpscout/ui-kit";
import { useEffect, useState } from "react";
import * as Mailjet from "node-mailjet";

function App() {
  const [userEmail, setUserEmail] = useState<string | undefined>("");
  const [userName, setUserName] = useState<string | undefined>("");

  useEffect(() => {
    HelpScout.getApplicationContext().then(({ user }) => {
      setUserEmail(user?.email);
      setUserName(user?.firstName + " " + user?.lastName);
    });
  }, []);

  function subscribeCustomer() {
    const mailjet = new Mailjet.Client({
      apiKey: process.env.MJ_APIKEY_PUBLIC,
      apiSecret: process.env.MJ_APIKEY_PRIVATE,
    });
    mailjet
      .post("contact", { version: "v3" })
      .request({
        IsExcludedFromCampaigns: false,
        Name: userName,
        Email: userEmail,
      })
      .then((result) => {
        console.log(result.body);

        HelpScout.showNotification(
          NOTIFICATION_TYPES.SUCCESS,
          "Contact successfully added mailing list!"
        );
      })
      .catch((err) => {
        console.log(err.statusCode);
      });
  }

  return (
    <div className="App">
      <DefaultStyle />
      Hello?
      <Button
        size="sm"
        onClick={() => {
          subscribeCustomer();
        }}
      >
        Add to mailing list
      </Button>
    </div>
  );
}

export default App;
