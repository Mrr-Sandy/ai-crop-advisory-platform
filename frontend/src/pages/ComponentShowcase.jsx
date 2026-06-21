import { useState } from "react";

import {
  Button,
  Input,
  Modal,
  Toast,
  Loader,
} from "../components/ui";

function ComponentShowcase() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ padding: "30px" }}>
      <h1>UI Component Library Showcase</h1>

      <h2>Button</h2>
      <Button
        text="Click Me"
        onClick={() => alert("Button Clicked")}
      />

      <h2>Input</h2>
      <Input placeholder="Enter your name" />

      <h2>Toast</h2>
      <Toast message="Successfully Added" />

      <h2>Loader</h2>
      <Loader />

      <h2>Modal</h2>
      <Button
        text="Open Modal"
        onClick={() => setIsOpen(true)}
      />

      <Modal
        isOpen={isOpen}
        title="Demo Modal"
        onClose={() => setIsOpen(false)}
      >
        <p>This is a modal component.</p>
      </Modal>
    </div>
  );
}

export default ComponentShowcase;