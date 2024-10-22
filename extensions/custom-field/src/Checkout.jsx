import React, { useState, useEffect } from "react";
import {
  reactExtension,
  TextField,
  BlockStack,
  useApplyMetafieldsChange,
  useMetafield,
  Checkbox,
  useStorage,
} from "@shopify/ui-extensions-react/checkout";

// [START custom-field.ext-index]
// Set the entry point for the extension
export default reactExtension("purchase.checkout.header.render-after", () => <App />);
// [END custom-field.ext-index]

function App() {
  console.log("App!!!!!!!!!!! OHHEHEHEHEHEEHEHHdJdhalkdsjfhasldkfjahsdflkjh");
  const [checked, setChecked] = useState(false);
  console.log("self", self);

  const storage = useStorage();
  console.log("storage", storage);

  const metafieldNamespace = "yourAppNamespace";
  const metafieldKey = "deliveryInstructions";

  const deliveryInstructions = useMetafield({
    namespace: metafieldNamespace,
    key: metafieldKey,
  });

  const applyMetafieldsChange = useApplyMetafieldsChange();


  // Set a function to handle the Checkbox component's onChange event
  const handleChange = () => {
    setChecked(!checked);
  };

  useEffect(() => {
    const setFXID = async () => {
      try {
        const firstCheck = await storage.read("WHOAAAAH");
        console.log("woah first check!!!!!", firstCheck);

        await storage.write("WHOAAAAH", "1234567890");
        const fxid = await storage.read("FXID");
        const whoah = await storage.read("WHOAAAAH");
        console.log("woah second check!!!!!", whoah);

        console.log("checkout_ext_FXID!!!!!", fxid);
        if (fxid) {
          console.log("checkout_ext_FXID_2!!!!!", fxid);

          applyMetafieldsChange({
            type: "updateMetafield",
            namespace: "$app",
            key: "FXID",
            valueType: "string",
            value: fxid,
          });
        }
      } catch (error) {
        console.error("Error reading FXID from storage:", error);
      }
    };

    setFXID();
  }, []);

  // [START custom-field.instruction-ui]
  // Render the extension components
  return (
    <BlockStack>
      <Checkbox checked={checked} onChange={handleChange}>
        Provide delivery instructions
      </Checkbox>
      {checked && (
        <TextField
          label="Delivery instructions"
          multiline={3}
          // [START custom-field.update-metafield]
          onChange={(value) => {
            // Apply the change to the metafield
            applyMetafieldsChange({
              type: "updateMetafield",
              namespace: metafieldNamespace,
              key: metafieldKey,
              valueType: "string",
              value,
            });
          }}
          // [END custom-field.update-metafield]
          value={deliveryInstructions?.value}
        />
      )}
    </BlockStack>
  );
  // [END custom-field.instruction-ui]
}
