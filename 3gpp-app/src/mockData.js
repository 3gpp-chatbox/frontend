// -------------- Mock data for testing the UI before backend integration --------------
export const MOCK_PROCEDURES = [
  {
    id: '1',
    name: 'NAS Security Mode Control Procedure',
    description:
      'To establish a 5G NAS security context and initialise NAS signalling security between the UE and the AMF. It can also be used to change security algorithms, update uplink NAS COUNT, and provide Selected EPS NAS security algorithms'
  },
  {
    id: '2',
    name: 'Identification Procedure',
    description:
      'To request a UE to provide specific identification parameters (SUCI, IMEI, IMEISV, EUI-64, MAC address).'
  },
  {
    id: '3',
    name: 'Generic UE Configuration Update procedure',
    description:
      ' A network-initiated procedure to update the UE s configuration parameters related to access and mobility management. It can be used to update various parameters, request a registration procedure, deliver UAV authorization information, or update PEIPS assistance information. The procedure uses the CONFIGURATION UPDATE COMMAND and CONFIGURATION UPDATE COMPLETE messages.'
  },
  {
    id: '4',
    name: 'EAP based primary authentication and key agreement procedure',
    description:
      'Mutual authentication between UE and network; Key agreement (KAUSF, KSEAF, KAMF) '
  },
  {
    id: '5',
    name: 'UE-initiated NAS transport procedure',
    description:
      'This procedure allows the UE to send various types of data (5GSM messages, SMS, LPP messages, etc.) to the AMF using the UL NAS TRANSPORT message. The AMF then routes the data to the appropriate network function (SMF, SMSF, LMF, UDM, PCF). The procedure is initiated when the UE has data to send to the network.'
  }
]

export const MOCK_DIAGRAMS = {
  1: `graph TD
        A["AMF: Initiate Security Mode Control (Send SECURITY MODE COMMAND, Start T3560)"] --> B{"UE: Receive SECURITY MODE COMMAND\nAcceptable?"}
        B -- "Yes" --> C["UE: Take Security Context into Use,\nReset Uplink NAS COUNT (if required),\nDerive K'AMF (if required),\nActivate Security Context on non-current access (if needed)"]
        C --> D["UE: Send SECURITY MODE COMPLETE"]
        D --> E["AMF: Receive SECURITY MODE COMPLETE,\nStop T3560,\nUse New Security Context,\nComplete Ongoing Procedure"]
        B -- "No" --> F["UE: Send SECURITY MODE REJECT"]
        F --> G["AMF: Receive SECURITY MODE REJECT,\nStop T3560,\nAbort Ongoing Procedure"]
        A --> H{"T3560 Expired?"}
        H -- "Yes (<=4 times)" --> A
        H -- "Yes (>4 times)" --> I["AMF: Abort Procedure"]
        H -- "No" --> J["Wait for response"]
        J --> E
        J --> G`,

  2: `graph TD
        A["AMF: Send IDENTITY REQUEST, Start T3570"] --> B{"UE: Receive IDENTITY REQUEST"};
        B -- "Identity Type != SUCI" --> C["UE: Send IDENTITY RESPONSE (Parameters)"];
        B -- "Identity Type == SUCI" --> D{"T3519 Running?"};
        D -- "No" --> E["UE: Generate Fresh SUCI, Send IDENTITY RESPONSE (SUCI), Start T3519, Store SUCI"];
        D -- "Yes" --> F["UE: Send IDENTITY RESPONSE (Stored SUCI)"];
        C --> G["AMF: Receive IDENTITY RESPONSE, Stop T3570"];
        F --> G
        G --> H{"Procedure Complete"};
        subgraph "Abnormal Cases (UE)"
            I["Transmission Failure of IDENTITY RESPONSE (triggered by Registration)"] --> J["UE: Re-initiate Registration"];
            K["Requested Identity Not Available"] --> L["UE: Encode Identity Type as 'No Identity'"];
        end
        subgraph "Abnormal Cases (Network)"
            M["Lower Layer Failure"] --> N["Network: Abort any ongoing 5GMM procedure"];
            O["Expiry of T3570"] --> P{"Retransmission Count < 4?"};
            P -- "Yes" --> Q["Network: Retransmit IDENTITY REQUEST, Reset and Restart T3570"];
            P -- "No" --> R["Network: Abort Identification Procedure, Abort any ongoing 5GMM procedure"];
        end`,

  3: `graph TD
        A["AMF: Initiate Generic UE Configuration Update"] --> B{"AMF: Send CONFIGURATION UPDATE COMMAND (Parameters)"};
        B -- "Acknowledgement Requested" --> C["UE: Receive CONFIGURATION UPDATE COMMAND"];
        B -- "No Acknowledgement Requested" --> F["UE: Update Configuration"];
        C --> D["UE: Update Configuration"];
        D --> E["UE: Send CONFIGURATION UPDATE COMPLETE"];
        E --> G["AMF: Receive CONFIGURATION UPDATE COMPLETE"];
        G --> H["AMF: Update UE Context"];
        F --> H
        H -->I["End"];
        C -- "Registration Requested" --> J["UE: Start Registration Procedure"];
        J --> I
            G -- "T3555 Expiry" --> K["AMF: Retransmit CONFIGURATION UPDATE COMMAND"];
            K --> B
        B -- "Lower Layer Failure" -->L["AMF: Handle Lower Layer Failure"];
        L -->I["End"];
            B -- "DEREGISTRATION REQUEST Received" --> M["AMF: Abort Generic UE Configuration Update and Progress De-registration"];
        M --> I
            B -- "REGISTRATION REQUEST Received" --> N["AMF: Abort Generic UE Configuration Update and Progress Registration"];
        N --> I
                    B -- "SERVICE REQUEST Received" --> O["AMF: Progress both procedures(if request type is not NAS signalling connection release), otherwise abort generic UE configuration update procedure and progress service request procedure"];
        O --> I`,

  4: `graph TD
        A["Network (AMF)"] -- "AUTHENTICATION REQUEST (EAP-Request, ngKSI, ABBA)" --> B("UE")
        B -- "Handle EAP-Request and ABBA" --> C{{"EAP Message Valid?"}}
        C -- Yes --> D["UE"] -- "AUTHENTICATION RESPONSE (EAP-Response)" --> E["Network (AMF)"]
        E -- "Stop Timer T3560, Handle EAP-Response" --> F{{"Authentication Successful?"}}
        F -- Yes, Security Mode Control Initiated --> G["Network (AMF)"] -- "SECURITY MODE COMMAND" --> H("UE")
        F -- Yes, No Security Mode Control Initiated --> I["Network (AMF)"] -- "AUTHENTICATION RESULT (EAP-Success, ngKSI)" --> J("UE")
        F -- No --> K["Network (AMF)"] -- "AUTHENTICATION RESULT (EAP-Failure)" --> L("UE")
        K -- "AUTHENTICATION REJECT (EAP-Failure)" --> L("UE")
        L -- "Handle EAP-Failure" --> M("Procedure Complete (Failure)")
        J -- "Handle EAP-Success" --> N("Procedure Complete (Success)")
        H -- "Execute Security Mode Control Procedure" --> O("Procedure Complete (Success)")
        A -- "Start Timer T3560" --> A
        B -- "Start Timer T3520 (if UE fails to authenticate the network)" --> B
        B -- "Start Timer T3520 (if UE does not accept server certificate)" --> B`,

  5: `graph TD
        A["UE in 5GMM-CONNECTED mode"] --> B{"UE initiates data transfer"}
        B --> C[/"Send UL NAS TRANSPORT message to AMF"/]
        C --> D{"AMF receives UL NAS TRANSPORT message"}
        D --> E{"Check Payload container type IE"}
        E -- "N1 SM information" --> F{"Look up PDU session routing context"}
        E -- "SMS" --> G[/"Send content to SMSF"/]
        E -- "LPP" --> H[/"Send content to LMF"/]
        E -- "SLPP" --> I[/"Send content to LMF"/]
        E -- "SOR" --> J[/"Send content to UDM"/]
        E -- "UE policy container" --> K[/"Send content to PCF"/]
        E -- "UE parameters update transparent container" --> L[/"Send content to UDM"/]
        E -- "Location services message container" --> M[/"Send content to upper layer location services application"/]
        E -- "CIoT user data container" --> N{"Look up PDU session routing context"}
        E -- "Service-level-AA container" --> O[/"Send content to UAS-NF"/]
        E -- "UPP-CMI container" --> P[/"Send content to upper layer location services application"/]
        E -- "Multiple payloads" --> Q{"Decode content of Payload container IE"}
        Q --> R{"Handle each payload container entry"}
        F -- "Context found" --> S[/"Send 5GSM message to SMF"/]
        F -- "Context not found" --> T{"Select SMF"}
        T --> U[/"Store PDU session routing context"/]
        U --> S
        N -- "Context found" --> V[/"Send content to SMF"/]
        N -- "Context not found" --> W[/"Send back CIoT user data container"/]
        D --> X{"Congestion Check?"}
        X -- "Yes" --> Y[/"Send DL NAS TRANSPORT with 5GMM cause and back-off timer"/]
        X -- "No" --> Z{"Proceed with routing"}
        D --> AA{"Access barring?"}
        AA -- "Yes" --> AB[/"UE stays in the current serving cell"/]
        AA -- "No" --> BB{"Proceed with transport"}
        subgraph UE Actions
        direction LR
        C
        end
        subgraph AMF Actions
        direction LR
        D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,AA,AB,BB
        end`
}
