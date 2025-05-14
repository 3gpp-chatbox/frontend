// Dummy data for procedures
export const dummyProcedures = [
  {
    procedure_id: "proc_001",
    procedure_name: "Initial Registration",
    entity: "UE"
  },
  {
    procedure_id: "proc_001",
    procedure_name: "Initial Registration",
    entity: "AMF"
  }
];

// Dummy data for individual procedure 
export const dummyProcedureData = {
  "proc_001": {
    procedure_id: "proc_001",
    entity: "UE",
    procedure_name: "Initial Registration",
    retrieved_section: "5.5.1",
    document: "3GPP TS 23.502 V19.1",
    created_at: "2025-05-14",
    version: "1.0",
    graph: {
        "edges": [
          {
            "from": "N1",
            "to": "N2",
            "type": "trigger",
            "description": "SECURITY MODE COMMAND message sent triggers integrity protection setup [section_ref: 5.4.2.2] [text_ref: ...use it to integrity protect the initial SECURITY MODE COMMAND message...]"
          },
          {
            "from": "N2",
            "to": "N3",
            "type": "trigger",
            "description": "Message integrity protection enables EPS algorithm delivery [section_ref: 5.4.2.2] [text_ref: ...SECURITY MODE COMMAND message shall also include the Selected EPS NAS security algorithms IE...]"
          },
          {
            "from": "N3",
            "to": "N4",
            "type": "trigger",
            "description": "Reception of EPS NAS algorithm triggers KAMF generation [section_ref: 5.4.2.2] [text_ref: ...and, if accepted, create a locally generated KAMF...]"
          },
          {
            "from": "N1",
            "to": "N5",
            "type": "condition",
            "description": "Check EPS NAS provision conditionally after initiation [section_ref: 5.4.2.2] [text_ref: ...the AMF shall check whether the selected EPS NAS security algorithms was successfully provided...]"
          },
          {
            "from": "N5",
            "to": "N6",
            "type": "trigger",
            "description": "If not provided, initiate mode control with mapped context [section_ref: 5.4.2.2] [text_ref: ...indicate the use of the new mapped 5G NAS security context...]"
          },
          {
            "from": "N6",
            "to": "N4",
            "type": "trigger",
            "description": "Mapped context usage leads to KAMF creation [section_ref: 5.4.2.2] [text_ref: ...UE shall process a SECURITY MODE COMMAND message...and create a locally generated KAMF...]"
          },
          {
            "from": "N4",
            "to": "N7",
            "type": "trigger",
            "description": "KAMF availability enables key re-derivation by AMF [section_ref: 5.4.2.2] [text_ref: ...AMF re-derives the 5G NAS keys from KAMF with the new 5G algorithm identities as input...]"
          }
        ],
        "nodes": [
          {
            "id": "N1",
            "type": "event",
            "description": "AMF initiates NAS Security Mode Control by sending SECURITY MODE COMMAND [section_ref: 5.4.2.2] [text_ref: The AMF initiates the NAS security mode control procedure by sending a SECURITY MODE COMMAND message to the UE...]"
          },
          {
            "id": "N2",
            "type": "state",
            "description": "SECURITY MODE COMMAND message is unciphered but integrity protected [section_ref: 5.4.2.2] [text_ref: The AMF shall send the SECURITY MODE COMMAND message unciphered, but shall integrity protect the message...]"
          },
          {
            "id": "N3",
            "type": "state",
            "description": "UE receives SECURITY MODE COMMAND with EPS NAS algorithms [section_ref: 5.4.2.2] [text_ref: The SECURITY MODE COMMAND message shall also include the Selected EPS NAS security algorithms IE...]"
          },
          {
            "id": "N4",
            "type": "event",
            "description": "UE accepts command and creates locally generated KAMF [section_ref: 5.4.2.2] [text_ref: The UE shall process a SECURITY MODE COMMAND message ... and, if accepted, create a locally generated KAMF...]"
          },
          {
            "id": "N5",
            "type": "event",
            "description": "AMF checks if EPS NAS algorithms were provided [section_ref: 5.4.2.2] [text_ref: the AMF shall check whether the selected EPS NAS security algorithms was successfully provided to the UE...]"
          },
          {
            "id": "N6",
            "type": "event",
            "description": "AMF initiates mode control using mapped 5G NAS context [section_ref: 5.4.2.2] [text_ref: AMF shall indicate the use of the new mapped 5G NAS security context to the UE...]"
          },
          {
            "id": "N7",
            "type": "event",
            "description": "AMF re-derives keys and updates algorithm identities [section_ref: 5.4.2.2] [text_ref: The AMF re-derives the 5G NAS keys from KAMF with the new 5G algorithm identities as input...]"
          }
        ]
    }
  }
};
