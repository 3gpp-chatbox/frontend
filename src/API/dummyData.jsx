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
        "nodes": [
          {
            "id": "UE_5GMM_REGISTERED",
            "type": "state",
            "description": "UE is registered with the network."
          },
          {
            "id": "UE_5GMM_REGISTERED_INITIATED",
            "type": "state",
            "description": "UE has initiated registration but it is not yet complete, e.g., during emergency registration."
          },
          {
            "id": "UE_5GMM_DEREGISTERED_INITIATED",
            "type": "state",
            "description": "UE has sent a DEREGISTRATION REQUEST (not for switch off) and is waiting for DEREGISTRATION ACCEPT."
          },
          {
            "id": "UE_5GMM_DEREGISTERED",
            "type": "state",
            "description": "UE is de-registered from the network. This is a general final state."
          },
          {
            "id": "UE_5GMM_DEREGISTERED_3GPP",
            "type": "state",
            "description": "UE is de-registered for 3GPP access."
          },
          {
            "id": "UE_5GMM_DEREGISTERED_Non3GPP",
            "type": "state",
            "description": "UE is de-registered for non-3GPP access."
          },
          {
            "id": "UE_5GMM_DEREGISTERED_Both",
            "type": "state",
            "description": "UE is de-registered for both 3GPP and non-3GPP access."
          },
          {
            "id": "UE_5GMM_NULL",
            "type": "state",
            "description": "UE has de-registered due to disabling 5GS services. This is a general final state."
          },
          {
            "id": "UE_5GMM_NULL_3GPP",
            "type": "state",
            "description": "UE has de-registered for 3GPP access due to disabling 5GS services."
          },
          {
            "id": "UE_5GMM_NULL_Non3GPP",
            "type": "state",
            "description": "UE has de-registered for non-3GPP access due to disabling 5GS services."
          },
          {
            "id": "UE_5GMM_NULL_Both",
            "type": "state",
            "description": "UE has de-registered for both accesses due to disabling 5GS services."
          },
          {
            "id": "UE_HANDLING_NW_DEREGISTRATION",
            "type": "state",
            "description": "UE is handling a network-initiated de-registration procedure after a collision."
          },
          {
            "id": "UE_PERFORMING_MOBILITY_REGISTRATION",
            "type": "state",
            "description": "UE needs to perform mobility registration before re-attempting de-registration."
          },
          {
            "id": "UE_WAITING_TO_RESTART_DEREG",
            "type": "state",
            "description": "UE is waiting for an implementation-dependent time after RRC suspension before potentially restarting de-registration."
          },
          {
            "id": "Event_UE_Initiates_Deregistration_Normal",
            "type": "event",
            "description": "UE decides to initiate normal de-registration (not switch off)."
          },
          {
            "id": "Event_UE_Initiates_Deregistration_SwitchOff",
            "type": "event",
            "description": "UE decides to initiate de-registration due to switch off."
          },
          {
            "id": "Event_UE_Receives_DEREGISTRATION_ACCEPT",
            "type": "event",
            "description": "UE receives the DEREGISTRATION ACCEPT message from the AMF."
          },
          {
            "id": "Event_UE_LowerLayerFailure_BeforeAccept",
            "type": "event",
            "description": "Lower layer failure or N1 signalling connection release occurs before receiving DEREGISTRATION ACCEPT."
          },
          {
            "id": "Event_UE_AccessBarred",
            "type": "event",
            "description": "UE finds access attempt is barred when trying to initiate de-registration."
          },
          {
            "id": "Event_UE_SpecificAccessBarred_AfterSending",
            "type": "event",
            "description": "Specific access barring condition (per subclause 5.5.2.2.6 ba) occurs after sending DEREGISTRATION REQUEST."
          },
          {
            "id": "Event_UE_T3521_Expiry",
            "type": "event",
            "description": "Timer T3521 expires while waiting for DEREGISTRATION ACCEPT."
          },
          {
            "id": "Event_UE_Receives_NW_DEREGISTRATION_REQUEST",
            "type": "event",
            "description": "UE receives a network-initiated DEREGISTRATION REQUEST message."
          },
          {
            "id": "Event_UE_Receives_CommonProcedureMsg",
            "type": "event",
            "description": "UE receives a message related to a 5GMM common procedure."
          },
          {
            "id": "Event_UE_TAI_Change_BeforeComplete",
            "type": "event",
            "description": "UE detects its current TAI is not in the stored TAI list before de-registration completes."
          },
          {
            "id": "Event_UE_TxFailure_TAI_Change",
            "type": "event",
            "description": "Transmission failure of DEREGISTRATION REQUEST indicated by lower layers, and current TAI is not in TAI list."
          },
          {
            "id": "Event_UE_TxFailure_TAI_Ok",
            "type": "event",
            "description": "Transmission failure of DEREGISTRATION REQUEST indicated by lower layers, and current TAI is still in TAI list."
          },
          {
            "id": "Event_UE_RRC_Suspended",
            "type": "event",
            "description": "Lower layers indicate that the RRC connection has been suspended."
          },
          {
            "id": "AMF_REGISTERED",
            "type": "state",
            "description": "AMF has a registration context for the UE."
          },
          {
            "id": "AMF_PROCESSING_UE_DEREGISTRATION",
            "type": "state",
            "description": "AMF is processing a received UE-initiated DEREGISTRATION REQUEST (not switch off, no initial SNPN/CAG issue)."
          },
          {
            "id": "AMF_5GMM_DEREGISTERED",
            "type": "state",
            "description": "AMF considers the UE de-registered. General final state, e.g., after switch off request."
          },
          {
            "id": "AMF_5GMM_DEREGISTERED_3GPP",
            "type": "state",
            "description": "AMF considers the UE de-registered for 3GPP access."
          },
          {
            "id": "AMF_5GMM_DEREGISTERED_Non3GPP",
            "type": "state",
            "description": "AMF considers the UE de-registered for non-3GPP access."
          },
          {
            "id": "AMF_5GMM_DEREGISTERED_Both",
            "type": "state",
            "description": "AMF considers the UE de-registered for both 3GPP and non-3GPP access."
          },
          {
            "id": "AMF_DEREGISTERING_UE_CAUSE_74",
            "type": "state",
            "description": "AMF initiates network de-registration due to UE request in non-global SNPN without subscription (Cause #74)."
          },
          {
            "id": "AMF_DEREGISTERING_UE_CAUSE_75",
            "type": "state",
            "description": "AMF initiates network de-registration due to UE request in global SNPN without subscription (Cause #75)."
          },
          {
            "id": "AMF_DEREGISTERING_UE_CAUSE_76",
            "type": "state",
            "description": "AMF initiates network de-registration due to UE request in unauthorized CAG cell or from CAG-only UE in non-CAG cell (Cause #76)."
          },
          {
            "id": "AMF_PROCESSING_REGISTRATION",
            "type": "state",
            "description": "AMF is processing an initial or emergency registration procedure after collision with de-registration."
          },
          {
            "id": "Event_AMF_Receives_DEREGISTRATION_REQUEST",
            "type": "event",
            "description": "AMF receives a DEREGISTRATION REQUEST message from the UE."
          },
          {
            "id": "Event_AMF_Receives_INITIAL_EMERGENCY_REGISTRATION_REQUEST",
            "type": "event",
            "description": "AMF receives an initial or emergency REGISTRATION REQUEST message from the UE."
          }
        ],
        "edges": [
          {
            "from": "UE_5GMM_REGISTERED",
            "to": "Event_UE_Initiates_Deregistration_Normal",
            "type": "trigger",
            "description": "UE in state 5GMM-REGISTERED decides to initiate normal de-registration."
          },
          {
            "from": "UE_5GMM_REGISTERED_INITIATED",
            "to": "Event_UE_Initiates_Deregistration_Normal",
            "type": "trigger",
            "description": "UE in state 5GMM-REGISTERED-INITIATED decides to initiate normal de-registration."
          },
          {
            "from": "Event_UE_Initiates_Deregistration_Normal",
            "to": "UE_5GMM_DEREGISTERED_INITIATED",
            "type": "condition",
            "description": "UE sends DEREGISTRATION REQUEST (not switch off), starts T3521."
          },
          {
            "from": "UE_5GMM_REGISTERED",
            "to": "Event_UE_Initiates_Deregistration_SwitchOff",
            "type": "trigger",
            "description": "UE in state 5GMM-REGISTERED decides to initiate de-registration due to switch off."
          },
          {
            "from": "UE_5GMM_REGISTERED_INITIATED",
            "to": "Event_UE_Initiates_Deregistration_SwitchOff",
            "type": "trigger",
            "description": "UE in state 5GMM-REGISTERED-INITIATED decides to initiate de-registration due to switch off."
          },
          {
            "from": "Event_UE_Initiates_Deregistration_SwitchOff",
            "to": "UE_5GMM_DEREGISTERED",
            "type": "condition",
            "description": "UE sends DEREGISTRATION REQUEST (switch off), procedure ends for UE."
          },
          {
            "from": "AMF_REGISTERED",
            "to": "Event_AMF_Receives_DEREGISTRATION_REQUEST",
            "type": "trigger",
            "description": "AMF receives a DEREGISTRATION REQUEST from the UE."
          },
          {
            "from": "Event_AMF_Receives_DEREGISTRATION_REQUEST",
            "to": "AMF_5GMM_DEREGISTERED",
            "type": "condition",
            "description": "Request indicates switch off. Procedure completes at AMF."
          },
          {
            "from": "Event_AMF_Receives_DEREGISTRATION_REQUEST",
            "to": "AMF_PROCESSING_UE_DEREGISTRATION",
            "type": "condition",
            "description": "Not switch off, no SNPN/CAG issue. AMF proceeds to process the request."
          },
          {
            "from": "AMF_PROCESSING_UE_DEREGISTRATION",
            "to": "AMF_5GMM_DEREGISTERED_3GPP",
            "type": "condition",
            "description": "Access type is 3GPP. AMF sends ACCEPT, triggers SMF release, marks UE inactive for 3GPP."
          },
          {
            "from": "AMF_PROCESSING_UE_DEREGISTRATION",
            "to": "AMF_5GMM_DEREGISTERED_Non3GPP",
            "type": "condition",
            "description": "Access type is non-3GPP. AMF sends ACCEPT, triggers SMF release, marks UE inactive for non-3GPP."
          },
          {
            "from": "AMF_PROCESSING_UE_DEREGISTRATION",
            "to": "AMF_5GMM_DEREGISTERED_Both",
            "type": "condition",
            "description": "Access type is both. AMF sends ACCEPT, triggers SMF release for both, marks UE inactive for both."
          },
          {
            "from": "UE_5GMM_DEREGISTERED_INITIATED",
            "to": "Event_UE_Receives_DEREGISTRATION_ACCEPT",
            "type": "trigger",
            "description": "UE is waiting for de-registration completion and receives the DEREGISTRATION ACCEPT message."
          },
          {
            "from": "Event_UE_Receives_DEREGISTRATION_ACCEPT",
            "to": "UE_5GMM_NULL",
            "type": "condition",
            "description": "De-reg was due to disabling 5GS services. Stop T3521/T3519. State applies per access type."
          },
          {
            "from": "Event_UE_Receives_DEREGISTRATION_ACCEPT",
            "to": "UE_5GMM_DEREGISTERED",
            "type": "condition",
            "description": "De-reg was not due to disabling 5GS services. Stop T3521/T3519. State applies per access type."
          },
          {
            "from": "UE_5GMM_DEREGISTERED_INITIATED",
            "to": "Event_UE_LowerLayerFailure_BeforeAccept",
            "type": "trigger",
            "description": "Lower layer failure or N1 signalling connection release occurs before receiving DEREGISTRATION ACCEPT."
          },
          {
            "from": "Event_UE_LowerLayerFailure_BeforeAccept",
            "to": "UE_5GMM_NULL",
            "type": "condition",
            "description": "Abort de-reg, stop T3521. Reason was disabling 5GS services."
          },
          {
            "from": "Event_UE_LowerLayerFailure_BeforeAccept",
            "to": "UE_5GMM_DEREGISTERED",
            "type": "condition",
            "description": "Abort de-reg, stop T3521. Reason was normal de-registration (not disabling 5GS)."
          },
          {
            "from": "UE_5GMM_REGISTERED",
            "to": "Event_UE_AccessBarred",
            "type": "trigger",
            "description": "UE attempts to initiate de-registration but access is barred."
          },
          {
            "from": "UE_5GMM_REGISTERED_INITIATED",
            "to": "Event_UE_AccessBarred",
            "type": "trigger",
            "description": "UE attempts to initiate de-registration but access is barred."
          },
          {
            "from": "Event_UE_AccessBarred",
            "to": "UE_5GMM_REGISTERED",
            "type": "condition",
            "description": "UE does not send DEREGISTRATION REQUEST, stays in current state."
          },
          {
            "from": "Event_UE_AccessBarred",
            "to": "UE_5GMM_DEREGISTERED",
            "type": "condition",
            "description": "UE performs local de-registration after implementation-dependent time due to access barring."
          },
          {
            "from": "UE_5GMM_DEREGISTERED_INITIATED",
            "to": "Event_UE_SpecificAccessBarred_AfterSending",
            "type": "trigger",
            "description": "Specific access barring condition met after sending DEREGISTRATION REQUEST."
          },
          {
            "from": "Event_UE_SpecificAccessBarred_AfterSending",
            "to": "UE_5GMM_NULL",
            "type": "condition",
            "description": "Abort de-reg, stop T3521. Reason was disabling 5GS services."
          },
          {
            "from": "Event_UE_SpecificAccessBarred_AfterSending",
            "to": "UE_5GMM_DEREGISTERED",
            "type": "condition",
            "description": "Abort de-reg, stop T3521. Reason was normal de-registration (not disabling 5GS)."
          },
          {
            "from": "UE_5GMM_DEREGISTERED_INITIATED",
            "to": "Event_UE_T3521_Expiry",
            "type": "trigger",
            "description": "Timer T3521 expires while waiting for DEREGISTRATION ACCEPT."
          },
          {
            "from": "Event_UE_T3521_Expiry",
            "to": "UE_5GMM_DEREGISTERED",
            "type": "condition",
            "description": "Condition from 23.122 Annex C met. Abort de-reg, local N1 release."
          },
          {
            "from": "Event_UE_T3521_Expiry",
            "to": "UE_5GMM_DEREGISTERED_INITIATED",
            "type": "condition",
            "description": "Not Annex C condition, expiry 1-4. Retransmit DEREGISTRATION REQUEST, restart T3521."
          },
          {
            "from": "Event_UE_T3521_Expiry",
            "to": "UE_5GMM_NULL",
            "type": "condition",
            "description": "Not Annex C condition, 5th expiry. Abort de-reg. Reason was disabling 5GS services."
          },
          {
            "from": "Event_UE_T3521_Expiry",
            "to": "UE_5GMM_DEREGISTERED",
            "type": "condition",
            "description": "Not Annex C condition, 5th expiry. Abort de-reg. Reason was normal de-registration (not disabling 5GS)."
          },
          {
            "from": "UE_5GMM_DEREGISTERED_INITIATED",
            "to": "Event_UE_Receives_NW_DEREGISTRATION_REQUEST",
            "type": "trigger",
            "description": "UE receives a network-initiated DEREGISTRATION REQUEST during its own de-registration procedure."
          },
          {
            "from": "Event_UE_Receives_NW_DEREGISTRATION_REQUEST",
            "to": "UE_5GMM_DEREGISTERED_INITIATED",
            "type": "condition",
            "description": "UE initiated switch-off. Ignore network request and continue UE procedure."
          },
          {
            "from": "Event_UE_Receives_NW_DEREGISTRATION_REQUEST",
            "to": "UE_HANDLING_NW_DEREGISTRATION",
            "type": "condition",
            "description": "UE initiated normal de-registration. Handle network request per 5.5.2.3.2."
          },
          {
            "from": "UE_5GMM_DEREGISTERED_INITIATED",
            "to": "Event_UE_Receives_CommonProcedureMsg",
            "type": "trigger",
            "description": "UE receives a message for a 5GMM common procedure during its de-registration procedure."
          },
          {
            "from": "Event_UE_Receives_CommonProcedureMsg",
            "to": "UE_5GMM_DEREGISTERED_INITIATED",
            "type": "condition",
            "description": "UE de-registration procedure continues (message might be ignored or handled concurrently depending on type)."
          },
          {
            "from": "UE_5GMM_DEREGISTERED_INITIATED",
            "to": "Event_UE_TAI_Change_BeforeComplete",
            "type": "trigger",
            "description": "UE detects a change in TAI (not in TAI list) before de-registration procedure completes."
          },
          {
            "from": "Event_UE_TAI_Change_BeforeComplete",
            "to": "UE_PERFORMING_MOBILITY_REGISTRATION",
            "type": "condition",
            "description": "Stop T3521, Abort de-reg. Reason not USIM removal/switch off/Tsor-cm. UE must perform mobility registration first."
          },
          {
            "from": "Event_UE_TAI_Change_BeforeComplete",
            "to": "UE_5GMM_DEREGISTERED",
            "type": "condition",
            "description": "Stop T3521, Abort de-reg. Reason is USIM removal/switch off/Tsor-cm. Perform local de-registration."
          },
          {
            "from": "UE_5GMM_REGISTERED",
            "to": "Event_UE_TxFailure_TAI_Change",
            "type": "trigger",
            "description": "Transmission failure of DEREGISTRATION REQUEST indicated, and current TAI is not in TAI list."
          },
          {
            "from": "UE_5GMM_REGISTERED_INITIATED",
            "to": "Event_UE_TxFailure_TAI_Change",
            "type": "trigger",
            "description": "Transmission failure of DEREGISTRATION REQUEST indicated, and current TAI is not in TAI list."
          },
          {
            "from": "UE_5GMM_DEREGISTERED_INITIATED",
            "to": "Event_UE_TxFailure_TAI_Change",
            "type": "trigger",
            "description": "Transmission failure of DEREGISTRATION REQUEST indicated, and current TAI is not in TAI list."
          },
          {
            "from": "Event_UE_TxFailure_TAI_Change",
            "to": "UE_PERFORMING_MOBILITY_REGISTRATION",
            "type": "condition",
            "description": "Stop T3521. Abort de-reg. Reason not USIM removal/switch off/Tsor-cm. UE must perform mobility registration first."
          },
          {
            "from": "Event_UE_TxFailure_TAI_Change",
            "to": "UE_5GMM_DEREGISTERED",
            "type": "condition",
            "description": "Stop T3521. Abort de-reg. Reason is USIM removal/switch off/Tsor-cm. Perform local de-registration."
          },
          {
            "from": "UE_5GMM_REGISTERED",
            "to": "Event_UE_TxFailure_TAI_Ok",
            "type": "trigger",
            "description": "Transmission failure of DEREGISTRATION REQUEST indicated, and current TAI is still in TAI list."
          },
          {
            "from": "UE_5GMM_REGISTERED_INITIATED",
            "to": "Event_UE_TxFailure_TAI_Ok",
            "type": "trigger",
            "description": "Transmission failure of DEREGISTRATION REQUEST indicated, and current TAI is still in TAI list."
          },
          {
            "from": "UE_5GMM_DEREGISTERED_INITIATED",
            "to": "Event_UE_TxFailure_TAI_Ok",
            "type": "trigger",
            "description": "Transmission failure of DEREGISTRATION REQUEST indicated, and current TAI is still in TAI list."
          },
          {
            "from": "Event_UE_TxFailure_TAI_Ok",
            "to": "UE_5GMM_REGISTERED",
            "type": "condition",
            "description": "Restart de-registration procedure from 5GMM-REGISTERED state."
          },
          {
            "from": "Event_UE_TxFailure_TAI_Ok",
            "to": "UE_5GMM_REGISTERED_INITIATED",
            "type": "condition",
            "description": "Restart de-registration procedure from 5GMM-REGISTERED-INITIATED state."
          },
          {
            "from": "UE_5GMM_DEREGISTERED_INITIATED",
            "to": "Event_UE_RRC_Suspended",
            "type": "trigger",
            "description": "Lower layers indicate RRC connection has been suspended during de-registration."
          },
          {
            "from": "Event_UE_RRC_Suspended",
            "to": "UE_5GMM_DEREGISTERED",
            "type": "condition",
            "description": "Stop T3521. UE initiated switch-off. UE may perform local de-registration."
          },
          {
            "from": "Event_UE_RRC_Suspended",
            "to": "UE_WAITING_TO_RESTART_DEREG",
            "type": "condition",
            "description": "Stop T3521. UE initiated normal de-registration. Wait implementation time."
          },
          {
            "from": "Event_AMF_Receives_DEREGISTRATION_REQUEST",
            "to": "AMF_DEREGISTERING_UE_CAUSE_74",
            "type": "condition",
            "description": "Not switch off, SNPN non-global, no subscription. AMF initiates NW de-reg (#74)."
          },
          {
            "from": "Event_AMF_Receives_DEREGISTRATION_REQUEST",
            "to": "AMF_DEREGISTERING_UE_CAUSE_75",
            "type": "condition",
            "description": "Not switch off, SNPN global, no subscription. AMF initiates NW de-reg (#75)."
          },
          {
            "from": "Event_AMF_Receives_DEREGISTRATION_REQUEST",
            "to": "AMF_DEREGISTERING_UE_CAUSE_76",
            "type": "condition",
            "description": "Not switch off, CAG issue (cell unauthorized or UE CAG-only in non-CAG). AMF initiates NW de-reg (#76)."
          },
          {
            "from": "AMF_PROCESSING_UE_DEREGISTRATION",
            "to": "Event_AMF_Receives_INITIAL_EMERGENCY_REGISTRATION_REQUEST",
            "type": "trigger",
            "description": "AMF receives an initial or emergency registration request while processing UE-initiated de-registration."
          },
          {
            "from": "Event_AMF_Receives_INITIAL_EMERGENCY_REGISTRATION_REQUEST",
            "to": "AMF_PROCESSING_REGISTRATION",
            "type": "condition",
            "description": "AMF aborts the de-registration procedure and progresses the registration procedure."
          }
        ]
    }
  }
};
