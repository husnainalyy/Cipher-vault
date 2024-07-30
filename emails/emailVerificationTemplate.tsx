import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import * as React from "react";

interface verificationEmailProps {
    username: string;
    otp: string;
}

export default function VerifyEmail({ username, otp }: verificationEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Cipher Vault Email Verification</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={coverSection}>
                        <Section style={upperSection}>
                            <Heading style={h1}>Hello {username}! Verify your email address</Heading>
                            <Text style={mainText}>
                                Thanks for starting the new Cipher Vault account creation process. We
                                want to make sure its really you. Please enter the following
                                verification code when prompted. If you dont want to
                                create an account, you can ignore this message.
                            </Text>
                            <Section style={verificationSection}>
                                <Text style={verifyText}>Verification code</Text>
                                <Text style={codeText}>{otp}</Text>
                                <Text style={validityText}>
                                    (This code is valid for 10 minutes)
                                </Text>
                            </Section>
                        </Section>
                        <Hr />
                        <Section style={lowerSection}>
                            <Text style={cautionText}>
                                Cipher Vault will never email you and ask you to disclose
                                or verify your password.
                            </Text>
                        </Section>
                    </Section>
                    <Text style={footerText}>
                        This message was produced and distributed by Cipher Vault,
                        Inc., 410 Terry Ave. North, Seattle, WA 98109. © 2022, Cipher Vault,
                        Inc. All rights reserved. Cipher Vault is a registered trademark
                        of{" "}
                        <Link href="https://cipherVault.com" target="_blank" style={link}>
                            CipherVault.com
                        </Link>
                        , Inc. View our{" "}
                        <Link href="https://cipherVault.com" target="_blank" style={link}>
                            privacy policy
                        </Link>
                        .
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}

const main = {
    backgroundColor: "#f4f4f4",
    color: "#333333",
    fontFamily: "'Arial', sans-serif",
};

const container = {
    padding: "20px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

const h1 = {
    color: "#2c3e50",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "15px",
};

const link = {
    color: "#3498db",
    fontSize: "14px",
    textDecoration: "none",
};

const text = {
    color: "#555555",
    fontSize: "14px",
    margin: "16px 0",
};

const coverSection = {
    backgroundColor: "#f9f9f9",
    padding: "20px",
};

const upperSection = {
    padding: "20px",
};

const lowerSection = {
    padding: "20px",
    backgroundColor: "#f1f1f1",
    borderRadius: "0 0 8px 8px",
};

const footerText = {
    ...text,
    fontSize: "12px",
    textAlign: "center",
    padding: "10px 0",
};

const verifyText = {
    ...text,
    fontWeight: "bold",
    margin: "0",
};

const codeText = {
    ...text,
    fontWeight: "bold",
    fontSize: "32px",
    margin: "10px 0",
    color: "#1abc9c",
};

const validityText = {
    ...text,
    margin: "0px",
};

const verificationSection = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
};

const mainText = { ...text, marginBottom: "14px" };

const cautionText = {
    ...text,
    margin: "0px",
    color: "#d9534f",
};
