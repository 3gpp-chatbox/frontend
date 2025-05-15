# Context for Registration procedure for mobility and periodic registration update

# 3GPP TS 24.501

#### 5.5.1.3 Registration procedure for mobility and periodic registration update

##### 5.5.1.3.1 General

This procedure is used by a UE for both mobility and periodic registration update of 5GS services. This procedure, when used for periodic registration update of 5GS services, is performed only in 3GPP access.

This procedure used for periodic registration update of 5GS services is controlled in the UE by timer T3512. When timer T3512 expires, the registration procedure for mobility and periodic registration update is started. Start and reset of timer T3512 is described in subclause 10.2.

If the MUSIM UE is registered for emergency services and initiates a registration procedure for mobility and periodic registration update, the network shall not indicate the support of:

- the NAS signalling connection release;

- the paging indication for voice services;

- the reject paging request; or

- the paging restriction;

in the REGISTRATION ACCEPT message.

##### 5.5.1.3.2 Mobility and periodic registration update initiation

The UE in state 5GMM-REGISTERED shall initiate the registration procedure for mobility and periodic registration update by sending a REGISTRATION REQUEST message to the AMF,

a) when the UE detects that the current TAI is not in the list of tracking areas that the UE previously registered in the AMF;

b) when the periodic registration updating timer T3512 expires in 5GMM-IDLE mode and the UE is not registered for emergency services (see subclause 5.3.7);

c) when the UE receives a CONFIGURATION UPDATE COMMAND message indicating "registration requested" in the Registration requested bit of the Configuration update indication IE as specified in subclauses 5.4.4.3;

d) when the UE in state 5GMM-REGISTERED.ATTEMPTING-REGISTRATION-UPDATE either receives a paging or the UE receives a NOTIFICATION message with access type indicating 3GPP access over the non-3GPP access for PDU sessions associated with 3GPP access;

NOTE 1: As an implementation option, MUSIM UE is allowed to not respond to paging based on the information available in the paging message, e.g. voice service indication.

e) upon inter-system change from S1 mode to N1 mode and if the UE previously had initiated an attach procedure or a tracking area updating procedure when in S1 mode;

f) when the UE receives an indication of "RRC Connection failure" from the lower layers and does not have signalling pending (i.e. when the lower layer requests NAS signalling connection recovery) except for the case specified in subclause 5.3.1.4;

g) when the UE changes the 5GMM capability or the S1 UE network capability or both;

h) when the UE's usage setting changes;

i) when the UE needs to change the slice(s) it is currently registered to;

NOTE 1A: The UE can after the completion of the ongoing registration procedure, initiate another registration procedure for mobility registration update to request more slices.

j) when the UE changes the UE specific DRX parameters;

k) when the UE in state 5GMM-REGISTERED.ATTEMPTING-REGISTRATION-UPDATE receives a request from the upper layers to establish an emergency PDU session or perform emergency services fallback;

l) when the UE needs to register for SMS over NAS, indicate a change in the requirements to use SMS over NAS, or de-register from SMS over NAS;

m) when the UE needs to indicate PDU session status to the network after performing a local release of PDU session(s) as specified in subclauses 6.4.1.5 and 6.4.3.5;

n) when the UE in 5GMM-IDLE mode changes the radio capability for NG-RAN or E-UTRAN;

o) when the UE receives a fallback indication from the lower layers and does not have signalling pending, see subclauses 5.3.1.4 and 5.3.1.2);

p) void;

q) when the UE needs to request new LADN information;

r) when the UE needs to request the use of MICO mode or needs to stop the use of MICO mode or to request the use of new T3324 value or new T3512 value;

s) when the UE in 5GMM-CONNECTED mode with RRC inactive indication enters a cell in the current registration area belonging to an equivalent PLMN of the registered PLMN and not belonging to the registered PLMN;

t) when the UE receives over 3GPP access a SERVICE REJECT message or a DL NAS TRANSPORT message, with the 5GMM cause value set to #28 "Restricted service area";

u) when the UE needs to request the use of eDRX, when a change in the eDRX usage conditions at the UE requires different extended DRX parameters, or needs to stop the use of eDRX;

NOTE 2: A change in the eDRX usage conditions at the UE can include e.g. a change in the UE configuration, a change in requirements from upper layers or the battery running low at the UE.

v) when the UE supporting 5G-SRVCC from NG-RAN to UTRAN changes the mobile station classmark 2 or the supported codecs;

w) when the UE in state 5GMM-REGISTERED.ATTEMPTING-REGISTRATION-UPDATE decides to request new network slices after being rejected due to no allowed network slices requested, or request S-NSSAI(s) which have been removed from the rejected NSSAI for the maximum number of UEs reached;

x) when the UE is not in NB-N1 mode and the UE has received a UE radio capability ID deletion indication IE set to "Network-assigned UE radio capability IDs deletion requested”;

y) when the UE receives a REGISTRATION REJECT message with 5GMM cause values #3, #6 or #7 without integrity protection over another access;

z) when the UE needs to request new ciphering keys for ciphered broadcast assistance data;

za) when due to manual CAG selection the UE has selected a CAG-ID which is not a CAG-ID authorized based on the "allowed CAG list" for the selected PLMN or a CAG-ID in a PLMN for which the entry in the "CAG information list" does not exist or when the UE has selected, without selecting a CAG-ID, a PLMN for which the entry in the "CAG information list" includes an "indication that the UE is only allowed to access 5GS via CAG cells";

zb) when the UE needs to start, stop or change the conditions for using the WUS assistance information or PEIPS assistance information;

zc) when the UE changes the UE specific DRX parameters in NB-N1 mode;

zd) when the UE in 5GMM-CONNECTED mode with RRC inactive indication enters a new cell with different RAT in current TAI list or not in current TAI list;

ze) when the UE enters state 5GMM-REGISTERED.NORMAL-SERVICE or 5GMM-REGISTERED.NON-ALLOWED-SERVICE (as described in subclause 5.3.5.2) over 3GPP access after the UE has sent a NOTIFICATION RESPONSE message over non-3GPP access in response to reception of a NOTIFICATION message over non-3GPP access as specified in subclause 5.6.3.1;

zf) when the UE supporting UAS services is not registered for UAS services and needs to register to the 5GS for UAS services;

zg) when the UE supporting MINT needs to perform the registration procedure for mobility and periodic registration update to register to the PLMN offering disaster roaming;

zh) when the MUSIM UE supporting the paging timing collision control needs to request a new 5G-GUTI assignment and the UE is not registered for emergency services;

NOTE 3: Based on implementation, the MUSIM UE can request a new 5G-GUTI assignment (e.g. when the lower layers request to modify the timing of the paging occasions).

zi) when the network supports the paging restriction and the MUSIM UE in state 5GMM-REGISTERED.NON-ALLOWED-SERVICE needs to requests the network to remove the paging restriction;

zj) when the UE changes the 5GS Preferred CIoT network behaviour or the EPS Preferred CIoT network behaviour;

zk) when the UE that has entered 5GMM-REGISTERED.NO-CELL-AVAILABLE and it has one or more S-NSSAI(s) in pending NSSAI, finds a suitable cell according to 3GPP TS 38.304 [28];

zl) when the UE is registered for disaster roaming services and receives a request from the upper layers to establish an emergency PDU session or perform emergency services fallback;

zm1) when the UE needs to provide the unavailability information or to update the unavailability information;

zm2) void;

NOTE 3A: How UE determines that it is about to lose satellite coverage is an implementation option.

zn) when the UE needs to come out of unavailability period and resume normal services;

zo) when the UE in state 5GMM-REGISTERED.ATTEMPTING-REGISTRATION-UPDATE, the UE supports the reconnection to the network due to RAN timing synchronization status change has been requested to reconnect to the network upon receiving an indication of a change in the RAN timing synchronization status (see subclauses 5.4.4.2, 5.5.1.2.4, and 5.5.1.3.4), and the UE receives an indication of a change in the RAN timing synchronization status; or

zp) when the UE that supports non-3GPP access path switching needs to trigger non-3GPP access path switching from the old non-3GPP access to the new non-3GPP access that is in the same PLMN.

NOTE 4: Non-3GPP access path switching from a non-3GPP access to a wireline access, or from a wireline access to a non-3GPP access, is not specified in this release of the specification.

zq) if the UE moves from a tracking area for which the TAI is configured for partially rejected NSSAI to another tracking area within the registration area with aTAI for which the S-NSSAI(s) is supported and the UE still needs to request that S-NSSAI(s).

NOTE 4A: The UEs that do not initiate the registration procedure for mobility and periodic registration update in the case above will not receive service for the S-NSSAI(s) that are configured to support the S-NSSAI(s) in the tracking areas supporting the S-NSSAI(s). Operators are recomended to consider the impact of such a configuration, of having partially rejected NSSAI applicable in some tracking areas within a registration area, as it requires the UE to perform mobility and periodic registration update procedure upon mobility within the same registration area.

If case b is the only reason for initiating the registration procedure for mobility and periodic registration update, the UE shall indicate "periodic registration updating" in the 5GS registration type IE; otherwise, if the UE initiates the registration procedure for mobility and periodic registration update due to case zg, the UE shall indicate "disaster roaming mobility registration updating" in the 5GS registration type IE; otherwise the UE shall indicate "mobility registration updating".

If case zl is the reason for initiating the registration procedure for mobility and periodic registration update and if the UE supports S1 mode and the UE has not disabled its E-UTRA capability, the UE shall:

- set the S1 mode bit to "S1 mode supported" in the 5GMM capability IE of the REGISTRATION REQUEST message; and

- include the S1 UE network capability IE in the REGISTRATION REQUEST message;

If the UE which is not registered for disaster roaming services indicates "mobility registration updating" in the 5GS registration type IE and the UE supports S1 mode and the UE has not disabled its E-UTRA capability, the UE shall:

- set the S1 mode bit to "S1 mode supported" in the 5GMM capability IE of the REGISTRATION REQUEST message;

- include the S1 UE network capability IE in the REGISTRATION REQUEST message additionally, if the UE supports EPS-UPIP, the UE shall set the EPS-UPIP bit to "EPS-UPIP supported" in the S1 UE network capability IE in the REGISTRATION REQUEST message; and

- if the UE supports sending an ATTACH REQUEST message containing a PDN CONNECTIVITY REQUEST message with request type set to "handover" to transfer a PDU session from N1 mode to S1 mode, set the HO attach bit to "attach request message containing PDN connectivity request with request type set to handover to transfer PDU session from N1 mode to S1 mode supported" in the 5GMM capability IE of the REGISTRATION REQUEST message.

If the UE supports the LTE positioning protocol (LPP) in N1 mode as specified in 3GPP TS 37.355 [26], the UE shall set the LPP bit to "LPP in N1 mode supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b.

If the UE supports the Location Services (LCS) notification mechanisms in N1 mode as specified in 3GPP TS 23.273 [6B], the UE shall set the 5G-LCS bit to "LCS notification mechanisms supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b.

If the UE supports the user plane positioning using LCS-UPP as specified in 3GPP TS 23.273 [6B], the UE shall set the LCS-UPP bit to "LCS-UPP user plane positioning supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b.

If the UE supports the user plane positioning using SUPL as specified in 3GPP TS 38.305 [67] and 3GPP TS 23.271 [68], the UE shall set the SUPL bit to "SUPL user plane positioning supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b.

If the UE supports network verified UE location over satellite NG-RAN as specified in 3GPP TS 23.501 [8], the UE shall set the NVL-SATNR bit to "Network verified UE location over satellite NG-RAN supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b.

For all cases except case b, when the UE is not in NB-N1 mode and the UE supports RACS, the UE shall set the RACS bit to "RACS supported" in the 5GMM capability IE of the REGISTRATION REQUEST message.

If the UE supports 5G-SRVCC from NG-RAN to UTRAN as specified in 3GPP TS 23.216 [6A], the UE shall set:

- the 5G-SRVCC from NG-RAN to UTRAN capability bit to "5G-SRVCC from NG-RAN to UTRAN supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b; and

- include the Mobile station classmark 2 IE and the Supported codecs IE in the REGISTRATION REQUEST message for all cases except case b.

If the UE supports the restriction on use of enhanced coverage, the UE shall set the RestrictEC bit to "Restriction on use of enhanced coverage supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b.

If the UE supports network slice-specific authentication and authorization, the UE shall set the NSSAA bit to "network slice-specific authentication and authorization supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b.

If the UE supports CAG feature, the UE shall set the CAG bit to "CAG Supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b.

If the UE supports extended CAG information list, the UE shall set the Ex-CAG bit to "Extended CAG information list supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b.

If the UE supports enhanced CAG information, the UE shall set the ECI bit to "enhanced CAG information supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b.

If the UE supports sending of REGISTRATION COMPLETE message for acknowledging the reception of Negotiated PEIPS assistance inforation IE, the UE shall set the RCMAP bit to "Sending of REGISTRATION COMPLETE message for negotiated PEIPS assistance information supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b.

If the UE operating in the single-registration mode performs inter-system change from S1 mode to N1 mode and:

a) has one or more stored UE policy sections identified by a UPSI with the PLMN ID part indicating the HPLMN or the selected PLMN, the UE shall set the Payload container type IE to "UE policy container" and include the UE STATE INDICATION message (see annex D) in the Payload container IE of the REGISTRATION REQUEST message; or

b) does not have any stored UE policy section identified by a UPSI with the PLMN ID part indicating the HPLMN or the selected PLMN, and the UE needs to send a UE policy container to the network, the UE shall set the Payload container type IE to "UE policy container" and include the UE STATE INDICATION message (see annex D) in the Payload container IE of the REGISTRATION REQUEST message.

NOTE 5: In this version of the protocol, the UE can only include the Payload container IE in the REGISTRATION REQUEST message to carry a payload of type "UE policy container".

The UE in state 5GMM-REGISTERED shall initiate the registration procedure for mobility and periodic registration update by sending a REGISTRATION REQUEST message to the AMF when the UE needs to request the use of SMS over NAS transport or the current requirements to use SMS over NAS transport change in the UE. The UE shall set the SMS requested bit of the 5GS update type IE in the REGISTRATION REQUEST message as specified in subclause 5.5.1.2.2.

When initiating a registration procedure for mobility and periodic registration update and the UE needs to send the 5GS update type IE for a reason different than indicating a change in requirement to use SMS over NAS, the UE shall set the SMS requested bit of the 5GS update type IE in the REGISTRATION REQUEST message to the same value as indicated by the UE in the last REGISTRATION REQUEST message.

If the UE no longer requires the use of SMS over NAS, then the UE shall include the 5GS update type IE in the REGISTRATION REQUEST message with the SMS requested bit set to "SMS over NAS not supported".

After sending the REGISTRATION REQUEST message to the AMF the UE shall start timer T3510. If timer T3502 is currently running, the UE shall stop timer T3502. If timer T3511 is currently running, the UE shall stop timer T3511.

If the last visited registered TAI is available, the UE shall include the last visited registered TAI in the REGISTRATION REQUEST message.

The UE shall handle the 5GS mobile identity IE in the REGISTRATION REQUEST message as follows:

a) if the UE is operating in the single-registration mode, performs inter-system change from S1 mode to N1 mode, and the UE holds a valid native 4G-GUTI, the UE shall create a 5G-GUTI mapped from the valid native 4G-GUTI as specified in 3GPP TS 23.003 [4] and indicate the mapped 5G-GUTI in the 5GS mobile identity IE. Additionally, if the UE holds a valid 5G-GUTI, the UE shall include the 5G-GUTI in the Additional GUTI IE in the REGISTRATION REQUEST message in the following order:

1) a valid 5G-GUTI that was previously assigned by the same PLMN with which the UE is performing the registration, if available;

2) a valid 5G-GUTI that was previously assigned by an equivalent PLMN, if available; and

3) a valid 5G-GUTI that was previously assigned by any other PLMN, if available; and

NOTE 6: The 5G-GUTI included in the Additional GUTI IE is a native 5G-GUTI.

b) for all other cases, if the UE holds a valid 5G-GUTI, the UE shall indicate the 5G-GUTI in the 5GS mobile identity IE. If the UE is registering with an SNPN and the valid 5G-GUTI was previously assigned by another SNPN, the UE shall additionally include the NID of the other SNPN in the NID IE.

If the UE does not operate in SNPN access operation mode, holds two valid native 5G-GUTIs assigned by PLMNs and:

1) one of the valid native 5G-GUTI was assigned by the PLMN with which the UE is performing the registration, then the UE shall indicate the valid native 5G-GUTI assigned by the PLMN with which the UE is performing the registration. In addition, the UE shall include the other valid native 5G-GUTI in the Additional GUTI IE; or

2) none of the valid native 5G-GUTI was assigned by the PLMN with which the UE is performing the registration, then the UE shall indicate the valid native 5G-GUTI assigned over the same access via which the UE is performing the registration.

If the UE supports MICO mode and requests the use of MICO mode, then the UE shall include the MICO indication IE in the REGISTRATION REQUEST message. If the UE requests to use an active time value, it shall include the active time value in the T3324 IE in the REGISTRATION REQUEST message. If the UE includes the T3324 IE, it may also request a particular T3512 value by including the Requested T3512 value IE in the REGISTRATION REQUEST message. Additionally, if the UE supports strictly periodic registration timer, the UE shall set the Strictly Periodic Registration Timer Indication bit of the MICO indication IE in the REGISTRATION REQUEST message to "strictly periodic registration timer supported". If the UE needs to stop the use of MICO mode, then the UE shall not include the MICO indication IE in the REGISTRATION REQUEST message.

If the UE needs to use or change the UE specific DRX parameters, the UE shall include the Requested DRX parameters IE in the REGISTRATION REQUEST message for all cases except case b.

If the UE is in NB-N1 mode and if the UE needs to use or change the UE specific DRX parameters for NB-N1 mode, the UE shall include the Requested NB-N1 mode DRX parameters IE in the REGISTRATION REQUEST message for all cases except case b.

If the UE supports eDRX and requests the use of eDRX, the UE shall include the Requested extended DRX parameters IE in the REGISTRATION REQUEST message.

For all cases except case b if the UE needs to request LADN information for specific LADN DNN(s) or indicates a request for LADN information as specified in 3GPP TS 23.501 [8], the UE shall include the LADN indication IE in the REGISTRATION REQUEST message and:

- request specific LADN DNNs by including a LADN DNN value in the LADN indication IE for each LADN DNN for which the UE requests LADN information; or

- to indicate a request for LADN information by not including any LADN DNN value in the LADN indication IE.

For all cases except case b if the UE is initiating the registration procedure for mobility and periodic registration update, the UE may include the Uplink data status IE to indicate which PDU session(s) is:

- not associated with control plane only indication;

- associated with the access type the REGISTRATION REQUEST message is sent over; and

- have pending user data to be sent over user plane or are associated with active multicast MBS session(s).

If the UE has one or more active always-on PDU sessions associated with the access type over which the REGISTRATION REQUEST message is sent and the user-plane resources for these PDU sessions are not established, and for cases triggering the REGISTRATION REQUEST message except b), the UE shall include the Uplink data status IE and indicate that the UE has pending user data to be sent for those PDU sessions. If the UE is located outside the LADN service area and inside the registration area assigned by the network, the UE shall not include the PDU session for LADN in the Uplink data status IE. If the UE is in a non-allowed area or is not in an allowed area as specified in subclause 5.3.5, and the UE is in the registration area assigned by the network, the UE shall not include the Uplink data status IE except for emergency services or for high priority access. If the MUSIM UE requests the network to release the NAS signalling connection, the UE shall not include the Uplink data status IE in the REGISTRATION REQUEST message.

If the UE has one or more active PDU sessions which are not accepted by the network as always-on PDU sessions and no uplink user data pending to be sent for those PDU sessions, the UE shall not include those PDU sessions in the Uplink data status IE in the REGISTRATION REQUEST message.

When the registration procedure for mobility and periodic registration update is initiated in 5GMM-IDLE mode, the UE may include a PDU session status IE in the REGISTRATION REQUEST message, indicating:

a) which single access PDU sessions associated with the access type the REGISTRATION REQUEST message is sent over are not inactive in the UE; and

b) which MA PDU sessions are not inactive and having the corresponding user plane resources being established or established in the UE on the access the REGISTRATION REQUEST message is sent over.

If the UE received a paging message with the access type indicating non-3GPP access, the UE shall include the Allowed PDU session status IE in the REGISTRATION REQUEST message. If the UE has PDU session(s) over non-3GPP access, where

a) the associated S-NSSAI(s) are included in the allowed NSSAI for 3GPP access or the partially allowed NSSAI for 3GPP access and the current TAI is in the list of TAs for which the S-NSSAI is allowed; and

b) the UE is currently located inside the NS-AoS of the S-NSSAI, if the S-NSSAI location validity information is available,

the UE shall indicate the PDU session(s) for which the UE allows to re-establish the user-plane resources over 3GPP access in the Allowed PDU session status IE; otherwise, the UE shall not indicate any PDU session(s) in the Allowed PDU session status IE. If the UE is in a non-allowed area or the UE is not in an allowed area, the UE shall set the Allowed PDU session status IE as specified in subclause 5.3.5.2.

When the Allowed PDU session status IE is included in the REGISTRATION REQUEST message, the UE shall indicate that a PDU session is not allowed to be transferred to the 3GPP access if the 3GPP PS data off UE status is "activated" for the corresponding PDU session and the UE is not using the PDU session to send uplink IP packets for any of the 3GPP PS data off exempt services (see subclause 6.2.10).

If the UE operating in the single-registration mode performs inter-system change from S1 mode to N1 mode, the UE:

a) shall include the UE status IE with the EMM registration status set to "UE is in EMM-REGISTERED state" in the REGISTRATION REQUEST message;

NOTE 7: Inclusion of the UE status IE with this setting corresponds to the indication that the UE is "moving from EPC" as specified in 3GPP TS 23.502 [9], subclause 4.11.1.3.3 and 4.11.2.3.

NOTE 8: The value of the 5GMM registration status included by the UE in the UE status IE is not used by the AMF.

b) may include the PDU session status IE in the REGISTRATION REQUEST message indicating the status of the PDU session(s) mapped during the inter-system change from S1 mode to N1 mode from the PDN connection(s) for which the EPS indicated that interworking to 5GS is supported, if any (see subclause 6.1.4.1);

c) shall include a TRACKING AREA UPDATE REQUEST message as specified in 3GPP TS 24.301 [15] in the EPS NAS message container IE in the REGISTRATION REQUEST message if the registration procedure is initiated in 5GMM-IDLE mode and the UE has received an "interworking without N26 interface not supported" indication from the network;

c1) may include a TRACKING AREA UPDATE REQUEST message as specified in 3GPP TS 24.301 [15] in the EPS NAS message container IE in the REGISTRATION REQUEST message if the registration procedure is initiated in 5GMM-IDLE mode and the UE has received an "interworking without N26 interface supported" indication from the network; and

d) shall include an EPS bearer context status IE in the REGISTRATION REQUEST message indicating which EPS bearer contexts are active in the UE, if the UE has locally deactivated EPS bearer context(s) for which interworking to 5GS is supported while the UE was in S1 mode without notifying the network.

For a REGISTRATION REQUEST message with a 5GS registration type IE indicating "mobility registration updating", if the UE:

a) is in NB-N1 mode and:

1) the UE needs to change the slice(s) it is currently registered to within the same registration area; or

2) the UE has entered a new registration area; or

b) is not in NB-N1 mode and is not registered for onboarding services in SNPN;

the UE shall include the Requested NSSAI IE containing the S-NSSAI(s) corresponding to the network slices to which the UE intends to register and associated mapped S-NSSAI(s), if available, in the REGISTRATION REQUEST message as described in this subclause. When the UE is entering a visited PLMN and intends to register to the slices for which the UE has only HPLMN S-NSSAI(s) available, the UE shall include these HPLMN S-NSSAI(s) in the Requested mapped NSSAI IE. When the UE is entering an EHPLMN whose PLMN code is not derived from the IMSI and intends to register to the slices for which the UE has only HPLMN S-NSSAI(s) available, the UE shall include HPLMN S-NSSAI(s) in the Requested mapped NSSAI IE. The sum of number of S-NSSAI values in the Requested NSSAI IE and number of S-NSSAI values in the Requested mapped NSSAI IE shall not exceed eight.

NOTE 9: The REGISTRATION REQUEST message can include both the Requested NSSAI IE and the Requested mapped NSSAI IE as described below.

If the UE is registered for onboarding services in SNPN, the UE shall not include the Requested NSSAI IE in the REGISTRATION REQUEST message.

For case b, the UE shall not include the Requested NSSAI IE in the REGISTRATION REQUEST message.

If the UE has allowed NSSAI or configured NSSAI or both for the current PLMN, the Requested NSSAI IE shall include either:

a) the configured NSSAI for the current PLMN or SNPN, or a subset thereof as described below;

b) the allowed NSSAI for the current PLMN or SNPN, or a subset thereof as described below; or

c) the allowed NSSAI for the current PLMN or SNPN, or a subset thereof as described below, plus the configured NSSAI for the current PLMN or SNPN, or a subset thereof as described below.

In addition, the Requested NSSAI IE shall include S-NSSAI(s) applicable in the current PLMN or SNPN, and if available the associated mapped S-NSSAI(s) for:

a) each PDN connection that is established in S1 mode when the UE is operating in the single-registration mode and the UE is performing an inter-system change from S1 mode to N1 mode; or

b) each active PDU session.

If the UE does not have S-NSSAI(s) applicable in the current PLMN or SNPN, then the Requested mapped NSSAI IE shall include HPLMN S-NSSAI(s) (e.g. mapped S-NSSAI(s), if available) for:

a) each PDN connection established in S1 mode when the UE is operating in the single-registration mode and the UE is performing an inter-system change from S1 mode to N1 mode to a visited PLMN; or

b) each active PDU session when the UE is performing mobility from N1 mode to N1 mode to a visited PLMN.

NOTE 10: The Requested NSSAI IE is used instead of Requested mapped NSSAI IE in REGISTRATION REQUEST message when the UE enters HPLMN and the EHPLMN list is not present or is empty; or when the UE enters a PLMN whose PLMN code is derived from the IMSI and the EHPLMN list is not empty. The Requested mapped NSSAI IE is used when the UE enters an EHPLMN whose PLMN code is not derived from the IMSI.

If both the S-NSSAI to be replaced and the alternative S-NSSAI are included in the configured NSSAI, and the UE needs to request the S-NSSAI to be replaced, the UE shall include the S-NSSAI to be replaced in the Requested NSSAI IE or the Requested mapped NSSAI IE.

For a REGISTRATION REQUEST message with a 5GS registration type IE indicating "mobility registration updating", if the UE is in NB-N1 mode and the procedure is initiated for all cases except case a), c), e), i), s), t), w), and x), the REGISTRATION REQUEST message shall not include the Requested NSSAI IE.

If the UE has:

- no allowed NSSAI for the current PLMN or SNPN;

- no configured NSSAI for the current PLMN or SNPN;

- neither active PDU session(s) nor PDN connection(s) to transfer associated with an S-NSSAI applicable in the current PLMN or SNPN; and

- neither active PDU session(s) nor PDN connection(s) to transfer associated with mapped S-NSSAI(s);

and has a default configured NSSAI, then the UE shall:

a) include the S-NSSAI(s) in the Requested NSSAI IE of the REGISTRATION REQUEST message using the default configured NSSAI; and

b) include the Network slicing indication IE with the Default configured NSSAI indication bit set to "Requested NSSAI created from default configured NSSAI" in the REGISTRATION REQUEST message.

If the UE has:

- no allowed NSSAI for the current PLMN or SNPN;

- no configured NSSAI for the current PLMN or SNPN;

- neither active PDU session(s) nor PDN connection(s) to transfer associated with an S-NSSAI applicable in the current PLMN or SNPN

- neither active PDU session(s) nor PDN connection(s) to transfer associated with mapped S-NSSAI(s); and

- no default configured NSSAI,

the UE shall include neither Requested NSSAI IE nor Requested mapped NSSAI IE in the REGISTRATION REQUEST message.

If all the S-NSSAI(s) corresponding to the slice(s) to which the UE intends to register are included in the pending NSSAI, the UE shall not include a requested NSSAI in the REGISTRATION REQUEST message.

When the UE storing a pending NSSAI intends to register to additional S-NSSAI(s) over the same access type, the UE shall send the requested NSSAI containing the additional S-NSSAI(s) that the UE intends to register to in the REGISTRATION REQUEST message. The requested NSSAI shall not include any S-NSSAI from the pending NSSAI.

The subset of configured NSSAI provided in the requested NSSAI consists of one or more S-NSSAIs in the configured NSSAI applicable to the current PLMN or SNPN, where any included S-NSSAI is neither in the rejected NSSAI nor associated to an S-NSSAI in the rejected NSSAI. If the UE is inside the NS-AoS of an S-NSSAI in the rejected NSSAI with a rejection cause value set to "S-NSSAI not available in the current registration area", the S-NSSAI may be included in the requested NSSAI.

For case zq, the subset of configured NSSAI provided in the requested NSSAI consists of one or more S-NSSAIs in the configured NSSAI applicable to the current PLMN or SNPN, where any included S-NSSAI is in the partially rejected NSSAI and the current TAI is in the list of TAs for which the S-NSSAI is not rejected. If the UE is inside the NS-AoS of an S-NSSAI in the partially rejected NSSAI and the current TAI is in the list of TAs for which the S-NSSAI is rejected, the S-NSSAI may be included in the requested NSSAI.

In addition, if the NSSRG information is available, the subset of configured NSSAI provided in the requested NSSAI shall be associated with at least one common NSSRG value. The UE may also include in the requested NSSAI included in the Requested NSSAI IE or the Requested mapped NSSAI IE or both, the S-NSSAI(s) which were added to configured NSSAI in S1 mode and for which the associated NSSRG information is not available. If the UE is in 5GMM-REGISTERED state over the other access and has already an allowed NSSAI for the other access in the same PLMN or in different PLMNs, all the S-NSSAI(s) in the requested NSSAI included in the Requested NSSAI IE or the Requested mapped NSSAI IE or both for the current access shall share at least an NSSRG value common to all the S-NSSAI(s) of the allowed NSSAI for the other access. If the UE is simultaneously performing the registration procedure on the other access in different PLMNs, the UE shall include S-NSSAIs that share at least a common NSSRG value across all access types. If the UE has pending NSSAI which the UE is still interested in using, then S-NSSAIs in the pending NSSAI and requested NSSAI shall be associated with at least one common NSSRG value.

NOTE 11: If the UE has stored mapped S-NSSAI(s) for the rejected NSSAI, and one or more S-NSSAIs in the stored mapped S-NSSAI(s) for the configured NSSAI are not included in the stored mapped S-NSSAI(s) for the rejected NSSAI, then a S-NSSAI in the configured NSSAI associated to one or more of these mapped S-NSSAI(s) for the configured NSSAI are available to be included in the requested NSSAI together with their mapped S-NSSAI.

NOTE 12: If one or more mapped S-NSSAIs in the stored mapped S-NSSAI(s) for the configured NSSAI are not included in the stored rejected NSSAI for the failed or revoked NSSAA, a S-NSSAI in the configured NSSAI associated to one or more of these mapped S-NSSAI(s) for the configured NSSAI are available to be included in the registration request together with their mapped S-NSSAI.

NOTE 13: There is no need to consider the case that the UE is simultaneously performing the registration procedure on the other access in the same PLMN, due to that the UE is not allowed to initiate the registration procedure over one access when the registration over the other access to the same PLMN is going on.

If:

a) the UE is registered to current PLMN over the other access and has NSSRG information available;

b) the UE is attempting mobility registration to the same current PLMN from other PLMN in the current access; and

c) the UE has PDU session(s) or PDN connection(s) associated with NSSAI not sharing part of NSSRG available of the current PLMN;

then the UE locally releases these PDU session(s) or PDN connection(s), as the NSSAI for these PDU session(s) or PDN connection(s) will not be included in the requested or the requested mapped NSSAI in the current PLMN due to its lack of association to the common NSSRG of the current PLMN.

The subset of allowed NSSAI provided in the requested NSSAI consists of one or more S-NSSAIs in the allowed NSSAI for this PLMN.

If the UE supports the S-NSSAI time validity information, S-NSSAI time validity information is available for an S-NSSAI, and the S-NSSAI time validity information indicates that the S-NSSAI is not available, the UE shall not include the S-NSSAI in the Requested NSSAI IE of the REGISTRATION REQUEST message. If the UE has S-NSSAI time validity information over the other access in the same PLMN and the S-NSSAI time validity information indicates that the S-NSSAI is not available, the UE shall not include the S-NSSAI in the Requested NSSAI IE of the REGISTRATION REQUEST message for the current access type.

NOTE 14: How the UE selects the subset of configured NSSAI or allowed NSSAI to be provided in the requested NSSAI is implementation specific. The UE can take preferences indicated by the upper layers (e.g. policies like URSP, applications) and UE local configuration into account.

NOTE 14A: If the UE determines the on-demand S-NSSAI for a PDU session establishment as specified in subclause 4.2.2 of 3GPP TS 24.526 [19], the UE includes the on-demand S-NSSAI in the requested NSSAI during the registration procedure.

NOTE 15: The number of S-NSSAI(s) included in the requested NSSAI cannot exceed eight.

If the UE supports NSAG, the UE shall set the NSAG bit to "NSAG supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b. If the UE supports sending of REGISTRATION COMPLETE message for acknowledging the reception of NSAG information IE in the REGISTRATION ACCEPT message, the UE shall set the RCMAN bit to "Sending of REGISTRATION COMPLETE message for NSAG information supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b.

If the UE supports the unavailability period, the UE shall set the UN-PER bit to "unavailability period supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b.

If the UE supports network slice replacement, the UE shall set the NSR bit to "network slice replacement supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b.

For case zm1, if the network indicated support for the unavailability period in the last registration procedure, the UE shall include the Unavailability information IE in the REGISTRATION REQUEST message. If the UE did not include a start of the unavailability period in the Unavailability information IE, the UE shall set the Follow-on request indicator to "No follow-on request pending" in the REGISTRATION REQUEST message and shall not include the Uplink data status IE or the Allowed PDU session status IE in the REGISTRATION REQUEST message even if the UE has one or more active always-on PDU sessions associated with the 3GPP access. If the UE includes the Unavailability information IE to indicate the type of the unavailability and the UE will be unavailable due to NR satellite access discontinuous coverage, the UE shall set the Unavailability type bit to "unavailability due to discontinuous coverage" in the Unavailability information IE.

For case zm1, the UE should initiate the registration procedure for mobility and periodic registration update only if the UE can determine, based on its implementation, that there is enough time to complete the procedure before the start of the unavailability period.

NOTE 15A: If the UE is unable to store its 5GMM and 5GSM contexts, the UE triggers the de-registration procedure. Ability to store the 5GMM information for UEs not operating in SNPN access operation mode as described in subclause C.1 does not imply the ability to store the 5GMM and 5GSM contexts.

NOTE 15B: If the UE is able to store its 5GMM and 5GSM contexts, the UE can store the 5GMM and 5GSM contexts even if the registration procedure for mobility and periodic registration update is not completed successfully.

The UE shall set the Follow-on request indicator to "Follow-on request pending", if the UE:

a) initiates the registration procedure for mobility and periodic registration update upon request of the upper layers to establish an emergency PDU session;

b) initiates the registration procedure for mobility and periodic registration update upon receiving a request from the upper layers to perform emergency services fallback; or

c) needs to prolong the established NAS signalling connection after the completion of the registration procedure for mobility and periodic registration update (e.g. due to uplink signalling pending but no user data pending).

NOTE 16: The UE does not have to set the Follow-on request indicator to 1 even if the UE has to request resources for V2X communication over PC5 reference point, 5G ProSe direct discovery over PC5, 5G ProSe direct communication over PC5 or ranging and sidelink positioning or A2X communication over PC5 reference point.

For case n, the UE shall include the 5GS update type IE in the REGISTRATION REQUEST message with the NG-RAN-RCU bit set to "UE radio capability update needed". Additionally, if the UE is not in NB-N1 mode, the UE supports RACS and the UE has an applicable UE radio capability ID for the new UE radio configuration in the serving PLMN or SNPN, the UE shall include the applicable UE radio capability ID in the UE radio capability ID of the REGISTRATION REQUEST message.

NOTE 16A: For cases n, if the UE supports RACS irrespective whether the UE has an applicable UE radio capability ID for the new UE radio configuration in the selected PLMN the 5GS update type IE in the REGISTRATION REQUEST message with the NG-RAN-RCU bit is set to "UE radio capability update needed".

If the UE is in the 5GMM-CONNECTED mode and the UE changes the radio capability for NG-RAN or E-UTRAN, the UE may locally release the established N1 NAS signalling connection and enter the 5GMM-IDLE mode. Then, the UE shall initiate the registration procedure for mobility and periodic registration update including the 5GS update type IE in the REGISTRATION REQUEST message with the NG-RAN-RCU bit set to " UE radio capability update needed".

For case o, the UE shall include the Uplink data status IE in the REGISTRATION REQUEST message indicating the PDU session(s) without active user-plane resources for which the UE has pending user data to be sent, if any, and the PDU session(s) for which user-plane resources were active prior to receiving the fallback indication, if any. If the UE has joined one or more multicast MBS session and was in 5GMM-CONNECTED mode with RRC inactive indication before receiving the fallback indication from the lower layers, the UE shall include the Uplink data status IE in the REGISTRATION REQUEST message indicating the PDU session(s) that are associated to the one or more multicast MBS session. If the UE is in a non-allowed area or if the UE is not in allowed area, the UE shall not include the Uplink data status IE in REGISTRATION REQUEST message, except if the PDU session for which user-plane resources were active prior to receiving the fallback indication is an emergency PDU session, or if the UE is configured for high priority access in the selected PLMN or SNPN as specified in subclause 5.3.5.

For case f, the UE shall include the Uplink data status IE in the REGISTRATION REQUEST message indicating the PDU session(s) for which the UE has uplink user data pending and the PDU session(s) for which user-plane resources were active prior to receiving "RRC Connection failure" indication from the lower layers, if any. If the UE has joined one or more multicast MBS session and was in 5GMM-CONNECTED mode with RRC inactive indication before receiving the indication of "RRC Connection failure" from the lower layers or before receiving the indication that the resumption of the RRC connection has failed from the lower layers, the UE shall include the Uplink data status IE in the REGISTRATION REQUEST message indicating the PDU session(s) that are associated to the one or more multicast MBS session. If the UE is in non-allowed area or not in allowed area, the UE shall not include the Uplink data status IE in REGISTRATION REQUEST message, except that the PDU session for which user-plane resources were active prior to receiving the "RRC Connection failure"indication is emergency PDU session, or that the UE is configured for high priority access in selected PLMN or SNPN, as specified in subclause 5.3.5.

If the UE supports service gap control, then the UE shall set the SGC bit to "service gap control supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b.

For cases a, x or if the UE operating in the single-registration mode performs inter-system change from S1 mode to N1 mode, the UE shall:

a) if the UE has an applicable network-assigned UE radio capability ID for the current UE radio configuration in the selected PLMN or SNPN, include the applicable network-assigned UE radio capability ID in the UE radio capability ID IE of the REGISTRATION REQUEST message; and

b) if the UE:

1) does not have an applicable network-assigned UE radio capability ID for the current UE radio configuration in the selected PLMN or SNPN; and

2) has an applicable manufacturer-assigned UE radio capability ID for the current UE radio configuration,

include the applicable manufacturer-assigned UE radio capability ID in the UE radio capability ID IE of the REGISTRATION REQUEST message.

For all cases except cases b and z, if the UE supports ciphered broadcast assistance data and the UE needs to obtain new ciphering keys, the UE shall include the Additional information requested IE with the CipherKey bit set to "ciphering keys for ciphered broadcast assistance data requested" in the REGISTRATION REQUEST message.

For case z, the UE shall include the Additional information requested IE with the CipherKey bit set to "ciphering keys for ciphered broadcast assistance data requested" in the REGISTRATION REQUEST message.

For case a, if the UE supports ciphered broadcast assistance data and the UE detects that one or more ciphering keys stored at the UE is not applicable in the current TAI, the UE should include the Additional information requested IE with the CipherKey bit set to "ciphering keys for ciphered broadcast assistance data requested" in the REGISTRATION REQUEST message.

For all cases except case b for case b, if the UE supports ciphered broadcast assistance data and the remaining validity time for one or more ciphering keys stored at the UE is less than timer T3512, the UE should include the Additional information requested IE with the CipherKey bit set to "ciphering keys for ciphered broadcast assistance data requested" in the REGISTRATION REQUEST message.

The UE shall set the WUSA bit to "WUS assistance information reception supported" in the 5GMM capability IE for all cases except case b, if the UE supports WUS assistance information. The UE may include its UE paging probability information in the Requested WUS assistance information IE if the UE has set the WUSA bit to "WUS assistance information reception supported" in the 5GMM capability IE and does not have an active emergency PDU session.

The UE shall set the NR-PSSI bit to "NR paging subgrouping supported" in the 5GMM capability IE for all cases except case b, if the UE supports PEIPS assistance information, is not registered for emergency services and does not have an active emergency PDU session. The UE may include its UE paging probability information in the Requested PEIPS assistance information IE if the UE has set the NR-PSSI bit to "NR paging subgrouping supported" in the 5GMM capability IE.

If the network supports the N1 NAS signalling connection release, and the MUSIM UE requests the network to release the NAS signalling connection, the UE shall set Request type to "NAS signalling connection release" in the UE request type IE, set the Follow-on request indicator to "No follow-on request pending" and, if the network supports the paging restriction, may set the paging restriction preference in the Paging restriction IE in the REGISTRATION REQUEST message. In addition, the UE shall not include the Uplink data status IE or the Allowed PDU session status IE in the REGISTRATION REQUEST message even if the UE has one or more active always-on PDU sessions associated with the 3GPP access.

NOTE 17: If the network has already indicated support for N1 NAS signalling connection release in the current stored registration area and the UE doesn't have an emergency PDU session established, the MUSIM UE is allowed to request the network to release the NAS signalling connection during registration procedure for mobility and periodic registration update that is due to mobility outside the registration area even before detecting whether the network supports the N1 NAS signalling connection release in the current TAI.

NOTE 18: If the network has already indicated support for paging restriction in the current stored registration area and the UE doesn't have an emergency PDU session established, the MUSIM UE is allowed to include paging restriction together with the request to the network to release the NAS signalling connection during registration procedure for mobility and periodic registration update that is due to mobility outside the registration area even before detecting whether the network supports the paging restriction in the current TAI.

For case zi, the UE shall not include the Paging restriction IE in the REGISTRATION REQUEST message. If the UE is in 5GMM-IDLE mode and the network supports the N1 NAS signalling connection release, the UE may include the UE request type IE and set Request type to "NAS signalling connection release" to remove the paging restriction and request the release of the NAS signalling connection at the same time. In addition, the UE shall not include the Uplink data status IE in the REGISTRATION REQUEST message.

If the UE does not have a valid 5G NAS security context and the UE is sending the REGISTRATION REQUEST message after an inter-system change from S1 mode to N1 mode in 5GMM-IDLE mode, the UE shall send the REGISTRATION REQUEST message without including the NAS message container IE. The UE shall include the entire REGISTRATION REQUEST message (i.e. containing cleartext IEs and non-cleartext IEs, if any) in the NAS message container IE that is sent as part of the SECURITY MODE COMPLETE message as described in subclauses 4.4.6 and 5.4.2.3.

If the UE indicates "mobility registration updating" in the 5GS registration type IE and supports V2X as specified in 3GPP TS 24.587 [19B], the UE shall set the V2X bit to "V2X supported" in the 5GMM capability IE of the REGISTRATION REQUEST message. If the UE indicates "mobility registration updating" in the 5GS registration type IE and supports V2X communication over E-UTRA-PC5 as specified in 3GPP TS 24.587 [19B], the UE shall set the V2XCEPC5 bit to "V2X communication over E-UTRA-PC5 supported" in the 5GMM capability IE of the REGISTRATION REQUEST message. If the UE indicates "mobility registration updating" in the 5GS registration type IE and supports V2X communication over NR-PC5 as specified in 3GPP TS 24.587 [19B], the UE shall set the V2XCNPC5 bit to "V2X communication over NR-PC5 supported" in the 5GMM capability IE of the REGISTRATION REQUEST message.

The UE shall send the REGISTRATION REQUEST message including the NAS message container IE as described in subclause 4.4.6:

a) when the UE is sending the message from 5GMM-IDLE mode, the UE has a valid 5G NAS security context, and needs to send non-cleartext IEs; or

b) when the UE is sending the message after an inter-system change from S1 mode to N1 mode in 5GMM-IDLE mode and the UE has a valid 5G NAS security context and needs to send non-cleartext IEs.

The UE with a valid 5G NAS security context shall send the REGISTRATION REQUEST message without including the NAS message container IE when the UE does not need to send non-cleartext IEs and the UE is sending the message:

a) from 5GMM-IDLE mode; or

b) after an inter-system change from S1 mode to N1 mode in 5GMM-IDLE mode.

If the UE is sending the REGISTRATION REQUEST message after an inter-system change from S1 mode to N1 mode in 5GMM-CONNECTED mode and the UE needs to send non-cleartext IEs, the UE shall cipher the NAS message container IE using the mapped 5G NAS security context and send the REGISTRATION REQUEST message including the NAS message container IE as described in subclause 4.4.6. If the UE does not need to send non-cleartext IEs, the UE shall send the REGISTRATION REQUEST message without including the NAS message container IE.

If the REGISTRATION REQUEST message includes a NAS message container IE, the AMF shall process the REGISTRATION REQUEST message that is obtained from the NAS message container IE as described in subclause 4.4.6.

If the UE is in NB-N1 mode, then the UE shall set the Control plane CIoT 5GS optimization bit to "Control plane CIoT 5GS optimization supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b. For all cases except case b, if the UE is capable of NB-S1 mode, then the UE shall set the Control plane CIoT EPS optimization bit to "Control plane CIoT EPS optimization supported" in the S1 UE network capability IE of the REGISTRATION REQUEST message.

If the registration procedure for mobility and periodic registration update is initiated and there is request from the upper layers to perform "emergency services fallback" pending, the UE shall send a REGISTRATION REQUEST message without an Uplink data status IE.

If the UE supports N3 data transfer and multiple user-plane resources in NB-N1 mode (see 3GPP TS 36.306 [25D], 3GPP TS 36.331 [25A]), then the UE shall set the Multiple user-plane resources support bit to "Multiple user-plane resources supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b.

The UE shall set the ER-NSSAI bit to "Extended rejected NSSAI supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b.

If the UE supports the NSSRG, then the UE shall set the NSSRG bit to "NSSRG supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b.

For case zf, the UE shall include the service-level device ID in the Service-level-AA container IE of the REGISTRATION REQUEST message and set the value to the CAA-level UAV ID. The UE shall include the service-level-AA server address in the Service-level-AA container IE of the REGISTRATION REQUEST message and set the value to the USS address, if it is provided by the upper layers. The UE shall include the service-level-AA payload in the Service-level-AA container IE of the REGISTRATION REQUEST message and shall set the service-level-AA payload type, if the service-level-AA payload is provided by upper layers.

NOTE 18: The service-level-AA payload can be of type "C2 authorization payload". The C2 authorization payload can include one or both of an indication of the request for direct C2 communication and pairing information for direct C2 communication.

For all cases except case b, then:

- if the UE supports 5G ProSe direct discovery as specified in 3GPP TS 24.554 [19E], the UE shall set the 5G ProSe-dd bit to "5G ProSe direct discovery supported" in the 5GMM capability IE of the REGISTRATION REQUEST message. If the UE supports 5G ProSe direct communication as specified in 3GPP TS 24.554 [19E], the UE shall set the 5G ProSe-dc bit to "5G ProSe direct communication supported" in the 5GMM capability IE of the REGISTRATION REQUEST message. If the UE supports acting as 5G ProSe layer-2 UE-to-network relay UE as specified in 3GPP TS 24.554 [19E], the UE shall set the 5G ProSe-l2relay bit to "Acting as a 5G ProSe layer-2 UE-to-network relay UE supported" in the 5GMM capability IE of the REGISTRATION REQUEST message. If the UE supports acting as 5G ProSe layer-3 UE-to-network relay UE as specified in 3GPP TS 24.554 [19E], the UE shall set the 5G ProSe-l3relay bit to "Acting as a 5G ProSe layer-3 UE-to-network relay UE supported" in the 5GMM capability IE of the REGISTRATION REQUEST message. If the UE supports acting as 5G ProSe layer-2 UE-to-network remote UE as specified in 3GPP TS 24.554 [19E], the UE shall set the 5G ProSe-l2rmt bit to "Acting as a 5G ProSe layer-2 UE-to-network remote UE supported" in the 5GMM capability IE of the REGISTRATION REQUEST message. If the UE supports acting as 5G ProSe layer-3 UE-to-network remote UE as specified in 3GPP TS 24.554 [19E], the UE shall set the 5G ProSe-l3rmt bit to "Acting as a 5G ProSe layer-3 UE-to-network remote UE supported" in the 5GMM capability IE of the REGISTRATION REQUEST message. If the UE supports acting as 5G ProSe layer-2 UE-to-UE relay UE as specified in 3GPP TS 24.554 [19E], the UE shall set the 5G ProSe-l2U2U relay bit to "Acting as a 5G ProSe layer-2 UE-to-UE relay UE supported" in the 5GMM capability IE of the REGISTRATION REQUEST message. If the UE supports acting as 5G ProSe layer-3 UE-to-UE relay UE as specified in 3GPP TS 24.554 [19E], the UE shall set the 5G ProSe-l3U2U relay bit to "Acting as a 5G ProSe layer-3 UE-to-UE relay UE supported" in the 5GMM capability IE of the REGISTRATION REQUEST message. If the UE supports acting as 5G ProSe layer-2 end UE as specified in 3GPP TS 24.554 [19E], the UE shall set the 5G ProSe-l2end bit to "Acting as a 5G ProSe layer-2 end UE supported" in the 5GMM capability IE of the REGISTRATION REQUEST message. If the UE supports acting as 5G ProSe layer-3 end UE as specified in 3GPP TS 24.554 [19E], the UE shall set the 5G ProSe-l3end bit to "Acting as a 5G ProSe layer-3 end UE supported" in the 5GMM capability IE of the REGISTRATION REQUEST message.

Editor’s note [WID:5G_ProSe_Ph3, CR:6552]: It is FFS how to enhance the 5G ProSe capability for multi-hop relays.

For all cases except case b, if the MUSIM UE supports the N1 NAS signalling connection release, then the UE shall set the N1 NAS signalling connection release bit to "N1 NAS signalling connection release supported" in the 5GMM capability IE of the REGISTRATION REQUEST message otherwise the UE shall not set the N1 NAS signalling connection release bit to "N1 NAS signalling connection release supported" in the 5GMM capability IE of the REGISTRATION REQUEST message.

For all cases except case b, if the MUSIM UE supports the paging indication for voice services, then the UE shall set the paging indication for voice services bit to "paging indication for voice services supported" in the 5GMM capability IE of the REGISTRATION REQUEST message otherwise the UE shall not set the paging indication for voice services bit to "paging indication for voice services supported" in the 5GMM capability IE of the REGISTRATION REQUEST message.

For all cases except case b, if the MUSIM UE supports the reject paging request, then the UE shall set the reject paging request bit to "reject paging request supported" in the 5GMM capability IE of the REGISTRATION REQUEST message otherwise the UE shall not set the reject paging request bit to "reject paging request supported" in the 5GMM capability IE of the REGISTRATION REQUEST message.

For all cases except case b, if the MUSIM UE sets:

- the reject paging request bit to "reject paging request supported";

- the N1 NAS signalling connection release bit to "N1 NAS signalling connection release supported"; or

- both of them;

and supports the paging restriction, then the UE shall set the paging restriction bit to "paging restriction supported" in the 5GMM capability IE of the REGISTRATION REQUEST message otherwise the UE shall not set the paging restriction bit to "paging restriction supported" in the 5GMM capability IE of the REGISTRATION REQUEST message.

If the UE supports MINT, the UE shall set the MINT bit to "MINT supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b.

If the UE supports slice-based N3IWF selection, the UE shall set the SBNS bit to "Slice-based N3IWF selection supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b.

If the UE supports slice-based TNGF selection, the UE shall set the SBTS bit to "Slice-based TNGF selection supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b.

For all cases except case b, then:

- if the UE supports UAS services, the UE shall set the UAS bit to "UAS services supported" in the 5GMM capability IE of the REGISTRATION REQUEST message. If the UE supports A2X over E-UTRA-PC5 as specified in 3GPP TS 24.577 [60], the UE shall set the A2XEPC5 bit to "A2X over E-UTRA-PC5 supported" in the 5GMM capability IE of the REGISTRATION REQUEST message. If the UE supports A2X over NR-PC5 as specified in 3GPP TS 24.577 [60], the UE shall set the A2XNPC5 bit to "A2X over NR-PC5 supported" in the 5GMM capability IE of the REGISTRATION REQUEST message. If the UE supports A2X over Uu as specified in 3GPP TS 24.577 [60], the UE shall set the A2X-Uu bit to "A2X over Uu supported" in the 5GMM capability IE of the REGISTRATION REQUEST message.

For case zg, if the UE has determined the UE determined PLMN with disaster condition as specified in 3GPP TS 23.122 [5], and:

a) the UE determined PLMN with disaster condition is the HPLMN and:

1) the Additional GUTI IE is included in the REGISTRATION REQUEST message and does not contain a valid 5G-GUTI that was previously assigned by the HPLMN; or

2) the Additional GUTI IE is not included in the REGISTRATION REQUEST message and the 5GS mobile identity IE contains neither the SUCI nor a valid 5G-GUTI that was previously assigned by the HPLMN; or

b) the UE determined PLMN with disaster condition is not the HPLMN and:

1) the Additional GUTI IE is included in the REGISTRATION REQUEST message and does not contain a valid 5G-GUTI that was previously assigned by the UE determined PLMN with disaster condition; or

2) the Additional GUTI IE is not included in the REGISTRATION REQUEST message and the 5GS mobile identity IE does not contain a valid 5G-GUTI that was previously assigned by the UE determined PLMN with disaster condition;

the UE shall include in the REGISTRATION REQUEST message the UE determined PLMN with disaster condition IE indicating the UE determined PLMN with disaster condition.

NOTE 19: If the UE initiates the registration procedure for disaster roaming services, and the UE determined PLMN with disaster condition cannot be determined when an NG-RAN cell of the PLMN broadcasts the disaster related indication as specified in 3GPP TS 23.122 [5], the UE does not include in the REGISTRATION REQUEST message the UE determined PLMN with disaster condition IE but includes the Additional GUTI IE or the 5GS mobile identity IE or both as specified in subclauses 5.5.1.2.2.

For case zh the UE shall indicate "mobility registration updating" in the 5GS registration type IE of the REGISTRATION REQUEST message.

For case zp, the UE shall send the REGISTRATION REQUEST message over the new non-3GPP access. The UE shall include the Uplink data status IE in the REGISTRATION REQUEST message indicating the MA PDU session ID(s) or the single access PDU session ID(s) whose user plan resources are to be switched from the old non-3GPP access to the new non-3GPP access or to be established over the new non-3GPP access, if any. If the UE requests the network to keep using the user plane resources of the old non-3GPP access during path switching to the new non-3GPP access, the UE shall include the Non-3GPP path switching information IE in the REGISTRATION REQUEST message and set the NSONR bit to "non-3GPP path switching while using old non-3GPP resources requested".

If the UE supports event notification, the UE shall set the EventNotification bit to "Event notification supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b.

If the UE supports access to an SNPN using credentials from a credentials holder and:

a) the UE is in its HPLMN or EHPLMN or the subscribed SNPN; or

b) the UE is in a non-subscribed SNPN and supports equivalent SNPNs;

the UE shall set the SSNPNSI bit to "SOR-SNPN-SI supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b.

If the UE supports equivalent SNPNs, the UE shall set the ESI bit to "equivalent SNPNs supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b. If the UE supports LADN per DNN and S-NSSAI, the UE shall set the LADN-DS bit to "LADN per DNN and S-NSSAI supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b.

If the UE supports the reconnection to the network due to RAN timing synchronization status change, the UE shall set the Reconnection to the network due to RAN timing synchronization status change (RANtiming) bit to "Reconnection to the network due to RAN timing synchronization status change supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b.

If the UE supports MPS indicator update via the UE configuration update procedure, the UE shall set the MPSIU bit to "MPS indicator update supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b.

If the UE supports MCS indicator update via the UE configuration update procedure, the UE shall set the MCSIU bit to "MCS indicator update supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b.

For all cases except case b, if the UE supports ranging and sidelink positioning as specified in 3GPP TS 24.514 [62] and supports:

a) V2X communication over PC5 as specified in 3GPP TS 24.587 [19B];

b) 5G ProSe direct discovery and 5G ProSe direct communication as specified in 3GPP TS 24.554 [19E]; or

c) both a) and b),

the UE shall set

a) the RSLP bit to "Ranging and sidelink positioning supported" if the UE supports ranging and sidelink positioning as target UE or SL reference UE or both;

b) the RSLPL bit to "Ranging and sidelink positioning for located UE supported" if the UE supports ranging and sidelink positioning as located UE;

c) the RSLPS bit to "Ranging and sidelink positioning for SL positioning server UE supported" if the UE supports ranging and sidelink positioning as SL positioning server UE; or

d) any combination of a), b) and c), in the 5GMM capability IE of the REGISTRATION REQUEST message;

and in addition:

a) if the UE supports ranging and sidelink positioning with V2X capable UE, the UE shall set the RSLPVU bit to "Ranging and sidelink positioning with V2X capable UE supported" in the 5GMM capability IE of the REGISTRATION REQUEST message; and

b) if the UE supports ranging and sidelink positioning with 5G ProSe capable UE, the UE shall set the RSLPPU bit to "Ranging and sidelink positioning with 5G ProSe capable UE supported" in the 5GMM capability IE of the REGISTRATION REQUEST message.

If the UE supports the partial network slice, the UE shall set the PNS bit to "Partial network slice supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b.

If the UE supports network slice usage control, the UE shall set the NSUC bit to "Network slice usage control supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b.

If the UE supports the S-NSSAI time validity information, the UE shall set the TempNS bit to "S-NSSAI time validity information supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b.

If the UE supports the S-NSSAI location validity information, the UE shall set the SLVI bit to "S-NSSAI location validity information supported" in the 5GMM capability IE of the REGISTRATION REQUEST message for all cases except case b.

If the UE supports RAT utilization control, the UE shall set the RATUC bit to "RAT utilization control supported" in the 5GMM capability IE of the REGISTRATION REQUEST message over 3GPP access for all cases except case b.

Figure 5.5.1.3.2.1: Registration procedure for mobility and periodic registration update

##### 5.5.1.3.3 5GMM common procedure initiation

The AMF may initiate 5GMM common procedures, e.g. the identification, authentication and security procedures during the registration procedure, depending on the information received in the REGISTRATION REQUEST message.

The AMF may be configured to skip the authentication procedure even if no 5GS security context is available and proceed directly to the execution of the security mode control procedure as specified in subclause 5.4.2, during the registration procedure for mobility and periodic registration update for a UE that has only an emergency PDU session.

The AMF shall not initiate a 5GMM authentication procedure before completion of the registration procedure for mobility and periodic registration update, if the following conditions apply:

a) the UE initiated the registration procedure for mobility and periodic registration update after handover or inter-system change to N1 mode in 5GMM-CONNECTED mode;

b) the target cell is a shared network cell; and

c.1) the UE has provided its 5G-GUTI in the 5GS mobile identity IE or the Additional GUTI IE in the REGISTRATION REQUEST message, and the PLMN identity included in the 5G-GUTI is different from the selected PLMN identity of the target cell; or

c.2) the UE has included the 5G-GUTI mapped from the 4G-GUTI in the 5GS mobile identity IE and not included an Additional GUTI IE in the REGISTRATION REQUEST message, and the PLMN identity included in the 5G-GUTI is different from the selected PLMN identity of the target cell.

##### 5.5.1.3.4 Mobility and periodic registration update accepted by the network

If the registration update request has been accepted by the network, the AMF shall send a REGISTRATION ACCEPT message to the UE.

NOTE 0: If the AMF receives the registration update request over non-3GPP access and detects that the N3IWF used by the UE is compatible with only part of the allowed NSSAI and the UE has not indicated its support for slice-based N3IWF selection in the REGISTRATION REQUEST message, the AMF accepts the registration update request.

NOTE 0A: If the AMF receives the registration update request over non-3GPP access and detects that the TNGF used by the UE is compatible with only part of the allowed NSSAI and the UE has not indicated its support for slice-based TNGF selection in the REGISTRATION REQUEST message, the AMF accepts the registration update request.

If timer T3513 is running in the AMF, the AMF shall stop timer T3513 if a paging request was sent with the access type indicating non-3GPP and the REGISTRATION REQUEST message includes the Allowed PDU session status IE.

If timer T3565 is running in the AMF, the AMF shall stop timer T3565 when a REGISTRATION REQUEST message is received.

For each of the information elements: 5GMM capability, S1 UE network capability, and UE security capability, the AMF shall store all octets received from the UE in the REGISTRATION REQUEST message, up to the maximum length defined for the respective information element.

NOTE 1: This information is forwarded to the new AMF during inter-AMF handover or to the new MME during inter-system handover to S1 mode.

The 5G-GUTI reallocation shall be part of the registration procedure for mobility registration update. The 5G-GUTI reallocation should be part of the registration procedure for periodic registration update. During the registration procedure for mobility registration update, if the AMF has not allocated a new 5G-GUTI by the generic UE configuration update procedure, the AMF shall include in the REGISTRATION ACCEPT message the new assigned 5G-GUTI.

If the UE has set the CAG bit to "CAG supported" in the 5GMM capability IE of the REGISTRATION REQUEST message and the AMF needs to update the "CAG information list" stored in the UE, the AMF shall include the CAG information list IE or the Extended CAG information list IE in the REGISTRATION ACCEPT message.

NOTE 2: The "CAG information list" can be provided by the AMF and include no entry if no "CAG information list" exists in the subscription.

NOTE 2A: If the UE supports extended CAG information list, the CAG information list can be included either in the CAG information list IE or Extended CAG information list IE.

If the UE does not support extended CAG information list, the CAG information list shall not be included in the Extended CAG information list IE.

If a 5G-GUTI or the SOR transparent container IE is included in the REGISTRATION ACCEPT message, the AMF shall start timer T3550 and enter state 5GMM-COMMON-PROCEDURE-INITIATED as described in subclause 5.1.3.2.3.3.

If the Operator-defined access category definitions IE or the Extended emergency number list IE ,the CAG information list IE or the Extended CAG information list IE are included in the REGISTRATION ACCEPT message, the AMF shall start timer T3550 and enter state 5GMM-COMMON-PROCEDURE-INITIATED as described in subclause 5.1.3.2.3.3.

If the UE has set the RCMP bit to "Sending of REGISTRATION COMPLETE message for negotiated PEIPS assistance information supported" in the 5GMM capability IE of the REGISTRATION REQUEST message and if the PEIPS assistance information IE is included in the REGISTRATION ACCEPT message, the AMF shall start timer T3550 and enter state 5GMM-COMMON-PROCEDURE-INITIATED as described in subclause 5.1.3.2.3.3.

If the UE is not in NB-N1 mode and the UE has set the RACS bit to "RACS supported" in the 5GMM Capability IE of the REGISTRATION REQUEST message, the AMF may include either a UE radio capability ID IE or a UE radio capability ID deletion indication IE in the REGISTRATION ACCEPT message. If the UE radio capability ID IE or the UE radio capability ID deletion indication IE is included in the REGISTRATION ACCEPT message, the AMF shall start timer T3550 and enter state 5GMM-COMMON-PROCEDURE-INITIATED as described in subclause 5.1.3.2.3.3.

The AMF may include a new TAI list for the UE in the REGISTRATION ACCEPT message. The new TAI list shall not contain both tracking areas in NB-N1 mode and tracking areas not in NB-N1 mode. The UE, upon receiving a REGISTRATION ACCEPT message, shall delete its old TAI list and store the received TAI list. If there is no TAI list received, the UE shall consider the old TAI list as valid. If the registration area contains TAIs belonging to different PLMNs, which are equivalent PLMNs, and

a) the UE already has stored allowed NSSAI for the current registration area, the UE shall store the allowed NSSAI for the current registration area in each of the allowed NSSAIs which are associated with each of the PLMNs in the registration area;

b) the UE already has stored rejected NSSAI for the current registration area, the UE shall store the rejected NSSAI for the current registration area in each of the rejected NSSAIs which are associated with each of the PLMNs in the registration area;

c) the UE already has stored rejected NSSAI for the failed or revoked NSSAA, the UE shall store the rejected NSSAI for the failed or revoked NSSAA in each of the rejected NSSAIs which are associated with each of the PLMNs in the registration area;

d) the UE already has stored rejected NSSAI for the maximum number of UEs reached, the UE shall store the rejected NSSAI for the maximum number of UEs reached in each of the rejected NSSAIs which are associated with each of the PLMNs in the registration area;

e) the UE already has stored pending NSSAI, the UE shall store the pending NSSAI in each of the pending NSSAIs which are associated with each of the PLMNs in the registration area; and

f) the UE already has stored partially rejected NSSAI, the UE shall store the partially rejected NSSAI in each of the partially rejected NSSAIs which are associated with each of the PLMNs in the registration area.

NOTE 3: When assigning the TAI list, the AMF can take into account the eNodeB's capability of support of CIoT 5GS optimization.

The AMF may also include a list of equivalent PLMNs in the REGISTRATION ACCEPT message. Each entry in the list contains a PLMN code (MCC+MNC). The UE shall store the list as provided by the network, and if there is no emergency PDU session established, the UE shall remove from the list any PLMN code that is already in the forbidden PLMN list as specified in subclause 5.3.13A. If the UE is not registered for emergency services and there is an emergency PDU session established, the UE shall remove from the list of equivalent PLMNs any PLMN code present in the forbidden PLMN list as specified in subclause 5.3.13A, when the emergency PDU session is released. In addition, the UE shall add to the stored list the PLMN code of the registered PLMN that sent the list. The UE shall replace the stored list on each receipt of the REGISTRATION ACCEPT message. If the REGISTRATION ACCEPT message does not contain a list, then the UE shall delete the stored list. The AMF of a PLMN shall not include a list of equivalent SNPNs.

If the ESI bit of the 5GMM capability IE of the REGISTRATION REQUEST message is set to "equivalent SNPNs supported", the AMF of a SNPN may include a list of equivalent SNPNs in the REGISTRATION ACCEPT message. If the UE is registered for onboarding services in SNPN, the AMF shall not include a list of equivalent SNPNs in the REGISTRATION ACCEPT message. Each entry in the list contains an SNPN identity. The UE shall store the list as provided by the network. If there is no emergency PDU session established and the UE is not registered for onboarding services in SNPN, the UE shall remove from the list any SNPN identity that is already in:

- the "permanently forbidden SNPNs" list or the "temporarily forbidden SNPNs" list, if the SNPN is not an SNPN selected for localized services in SNPN (see 3GPP TS 23.122 [5]); or

- the "permanently forbidden SNPNs for access for localized services in SNPN" list or the " temporarily forbidden SNPNs for access for localized services in SNPN" list, if the SNPN is an SNPN selected for localized services in SNPN (see 3GPP TS 23.122 [5]).

If the UE is not registered for emergency services and there is an emergency PDU session established, the UE shall remove from the list of equivalent SNPNs any SNPN identity present in the "permanently forbidden SNPNs" list or the "temporarily forbidden SNPNs" list, when the emergency PDU session is released. The UE shall add to the stored list the SNPN identity of the registered SNPN that sent the list. The UE shall replace the stored list on each receipt of the REGISTRATION ACCEPT message. If the REGISTRATION ACCEPT message does not contain a list, then the UE shall delete the stored list. The AMF of an SNPN shall not include a list of equivalent PLMNs.

NOTE 3A0: If N1 mode was disabled for an SNPN due to reception of 5GMM cause #27 or #62, the UE implementation ensures that it does not register to this SNPN due to being part of the list of "equivalent SNPNs" received while registered in another SNPN.

If the UE is not registered for emergency services, and if the PLMN identity of the registered PLMN is a member of the forbidden PLMN list as specified in subclause 5.3.13A, any such PLMN identity shall be deleted from the corresponding list(s).

The AMF may include new service area restrictions in the Service area list IE in the REGISTRATION ACCEPT message. The UE, upon receiving a REGISTRATION ACCEPT message with new service area restrictions shall act as described in subclause 5.3.5.

If the Service area list IE is not included in the REGISTRATION ACCEPT message, any tracking area in the registered PLMN and its equivalent PLMN(s) in the registration area, or in the registered SNPN, is considered as an allowed tracking area as described in subclause 5.3.5.

The AMF shall include the MICO indication IE in the REGISTRATION ACCEPT message only if the MICO indication IE was included in the REGISTRATION REQUEST message, the AMF supports and accepts the use of MICO mode. If the AMF supports and accepts the use of MICO mode, the AMF may indicate "all PLMN registration area allocated" in the MICO indication IE in the REGISTRATION ACCEPT message. If "all PLMN registration area allocated" is indicated in the MICO indication IE, the AMF shall not assign and include the TAI list in the REGISTRATION ACCEPT message. If the REGISTRATION ACCEPT message includes an MICO indication IE indicating "all PLMN registration area allocated", the UE shall treat all TAIs in the current PLMN as a registration area and delete its old TAI list. If "strictly periodic registration timer supported" is indicated in the MICO indication IE in the REGISTRATION REQUEST message, the AMF may indicate "strictly periodic registration timer supported" in the MICO indication IE and may include the T3512 value IE in the REGISTRATION ACCEPT message. If the timer value received in T3512 IE is different from the already stored value of the timer T3512 and the timer T3512 is running, the UE shall restart T3512 with the new value received in the T3512 value IE.

The AMF shall include an active time value in the T3324 IE in the REGISTRATION ACCEPT message if the UE requested an active time value in the REGISTRATION REQUEST message and the AMF accepts the use of MICO mode and the use of active time.

If the UE does not include MICO indication IE in the REGISTRATION REQUEST message, then the AMF shall disable MICO mode if it was already enabled.

If the AMF supports and accepts the use of MICO, and the UE included the Requested T3512 value IE in the REGISTRATION REQUEST message, then the AMF shall take into account the T3512 value requested when providing the T3512 value IE in the REGISTRATION ACCEPT message.

NOTE 3A: The T3512 value assigned to the UE by AMF can be different from the T3512 value requested by the UE. AMF can take several factors into account when assigning the T3512 value, e.g. local configuration, expected UE behaviour, UE requested T3512 value, UE subscription data, network policies.

The AMF may include the T3512 value IE in the REGISTRATION ACCEPT message only if the REGISTRATION REQUEST message was sent over the 3GPP access.

The AMF may include the non-3GPP de-registration timer value IE in the REGISTRATION ACCEPT message only if the REGISTRATION REQUEST message was sent for the non-3GPP access.

If the UE indicates support of the N1 NAS signalling connection release in the REGISTRATION REQUEST message and the network decides to accept the N1 NAS signalling connection release, then the AMF shall set the N1 NAS signalling connection release bit to "N1 NAS signalling connection release supported" in the 5GS network feature support IE of the REGISTRATION ACCEPT message.

If the UE indicates support of the paging indication for voice services in the REGISTRATION REQUEST message and the network decides to accept the paging indication for voice services, then the AMF shall set the paging indication for voice services bit to "paging indication for voice services supported" in the 5GS network feature support IE of the REGISTRATION ACCEPT message. If the UE receives the REGISTRATION ACCEPT message with the paging indication for voice services bit set to "paging indication for voice services supported", the UE NAS layer informs the lower layers that paging indication for voice services is supported. Otherwise, the UE NAS layer informs the lower layers that paging indication for voice services is not supported.

If the UE indicates support of the reject paging request in the REGISTRATION REQUEST message and the network decides to accept the reject paging request, then the AMF shall set the reject paging request bit to "reject paging request supported" in the 5GS network feature support IE of the REGISTRATION ACCEPT message.

If the UE indicates support of the paging restriction in the REGISTRATION REQUEST message, and the AMF sets:

- the reject paging request bit to "reject paging request supported";

- the N1 NAS signalling connection release bit to "N1 NAS signalling connection release supported"; or

- both of them;

in the 5GS network feature support IE of the REGISTRATION ACCEPT message, and the network decides to accept the paging restriction, then the AMF shall set the paging restriction bit to "paging restriction supported" in the 5GS network feature support IE of the REGISTRATION ACCEPT message.

If the MUSIM UE does not include the Paging restriction IE in the REGISTRATION REQUEST message, the AMF shall delete any stored paging restriction for the UE and stop restricting paging.

If the MUSIM UE requests the release of the NAS signalling connection, by setting Request type to "NAS signalling connection release" in the UE request type IE included in the REGISTRATION REQUEST message, and the AMF supports the N1 NAS signalling connection release, the AMF shall initiate the release of the NAS signalling connection after the completion of the registration procedure for mobility and periodic registration update. If the UE requests restriction of paging by including the Paging restriction IE and the AMF supports the paging restriction, the AMF:

- if accepts the paging restriction, shall include the 5GS additional request result IE in the REGISTRATION ACCEPT message and set the Paging restriction decision to "paging restriction is accepted". The AMF shall store the paging restriction of the UE and enforce these restrictions in the paging procedure as described in subclause 5.6.2; or

- if rejects the paging restriction, shall include the 5GS additional request result IE in the REGISTRATION ACCEPT message and set the Paging restriction decision to "paging restriction is rejected", and shall discard the received paging restriction. The AMF shall delete any stored paging restriction for the UE and stop restricting paging.

If the UE requests "control plane CIoT 5GS optimization" in the 5GS update type IE, indicates support of control plane CIoT 5GS optimization in the 5GMM capability IE and the AMF decides to accept the requested CIoT 5GS optimization and the registration request, the AMF shall indicate "control plane CIoT 5GS optimization supported" in the 5GS network feature support IE of the REGISTRATION ACCEPT message.

If the UE has indicated support for the control plane CIoT 5GS optimizations, and the AMF decides to activate the congestion control for transport of user data via the control plane, then the AMF shall include the T3448 value IE in the REGISTRATION ACCEPT message.

If the AMF decides to deactivate the congestion control for transport of user data via the control plane, then the AMF shall delete the stored control plane data back-off time for the UE and the AMF shall not include timer T3448 value IE in the REGISTRATION ACCEPT message.

If:

- the UE in NB-N1 mode is using control plane CIoT 5GS optimization; and

- the network is configured to provide the truncated 5G-S-TMSI configuration for control plane CIoT 5GS optimizations;

the AMF shall include the Truncated 5G-S-TMSI configuration IE in the REGISTRATION ACCEPT message and set the "Truncated AMF Set ID value" and the "Truncated AMF Pointer value" in the Truncated 5G-S-TMSI configuration IE based on network policies. The AMF shall start timer T3550 and enter state 5GMM-COMMON-PROCEDURE-INITIATED as described in subclause 5.1.3.2.3.3.

For inter-system change from S1 mode to N1 mode in 5GMM-IDLE mode, if the UE has included a ngKSI indicating a current 5G NAS security context in the REGISTRATION REQUEST message by which the REGISTRATION REQUEST message is integrity protected, the AMF shall take one of the following actions:

a) if the AMF retrieves the current 5G NAS security context as indicated by the ngKSI and 5G-GUTI sent by the UE, the AMF shall integrity check the REGISTRATION REQUEST message using the current 5G NAS security context and integrity protect the REGISTRATION ACCEPT message using the current 5G NAS security context;

b) if the AMF cannot retrieve the current 5G NAS security context as indicated by the ngKSI and 5G-GUTI sent by the UE, the AMF shall treat the REGISTRATION REQUEST message fails the integrity check and take actions as specified in subclause 4.4.4.3; or

c) if the UE has not included an Additional GUTI IE, the AMF may treat the REGISTRATION REQUEST message as in the previous item, i.e. as if it cannot retrieve the current 5G NAS security context.

NOTE 4: The handling described above at failure to retrieve the current 5G NAS security context or if no Additional GUTI IE was provided does not preclude the option for the AMF to perform a primary authentication and key agreement procedure and create a new native 5G NAS security context.

For inter-system change from S1 mode to N1 mode in 5GMM-CONNECTED mode, the AMF shall integrity check REGISTRATION REQUEST message using the current K'AMF as derived when triggering the handover to N1 mode (see subclause 4.4.2.2). The AMF shall verify the received UE security capabilities in the REGISTRATION REQUEST message. The AMF shall then take one of the following actions:

a) if the REGISTRATION REQUEST does not contain a valid KSIAMF in the Non-current native NAS key set identifier IE, the AMF shall remove the non-current native 5G NAS security context, if any, for any 5G-GUTI for this UE. The AMF shall then integrity protect and cipher the REGISTRATION ACCEPT message using the security context based on K'AMF and take the mapped 5G NAS security context into use; or

b) if the REGISTRATION REQUEST contains a valid KSIAMF in the Non-current native NAS key set identifier IE and:

1) the AMF decides to take the native 5G NAS security context into use, the AMF shall initiate a security mode control procedure to take the corresponding native 5G NAS security context into use and then integrity protect and cipher the REGISTRATION ACCEPT message using the corresponding native 5G NAS security context; and

2) otherwise, the AMF shall then integrity protect and cipher the REGISTRATION ACCEPT message using the security context based on K'AMF and take the mapped 5G NAS security context into use.

NOTE 5: In above bullet b), it is recommended for the AMF to initiate a security mode control procedure to take the corresponding native 5G NAS security context into use.

If the UE has included the service-level device ID set to the CAA-level UAV ID in the Service-level-AA container IE of the REGISTRATION REQUEST message, and if:

- the UE has a valid aerial UE subscription information; and

- the UUAA procedure is to be performed during the registration procedure according to operator policy; and

- there is no valid successful UUAA result for the UE in the UE 5GMM context,

then the AMF shall initiate the UUAA-MM procedure with the UAS-NF as specified in 3GPP TS 23.256 [6AB] and shall include a service-level-AA pending indication in the Service-level-AA container IE of the REGISTRATION ACCEPT message. The AMF shall store in the UE 5GMM context that a UUAA procedure is pending. The AMF shall start timer T3550 and enter state 5GMM-COMMON-PROCEDURE-INITIATED as described in subclause 5.1.3.2.3.3.

If the UE has included the service-level device ID set to the CAA-level UAV ID in the Service-level-AA container IE of the REGISTRATION REQUEST message, and if:

- the UE has a valid aerial UE subscription information;

- the UUAA procedure is to be performed during the registration procedure according to operator policy; and

- there is a valid successful UUAA result for the UE in the UE 5GMM context,

then the AMF shall include a service-level-AA response in the Service-level-AA container IE of the REGISTRATION ACCEPT message and set the SLAR field in the service-level-AA response to "Service level authentication and authorization was successful".

If the AMF determines that the UUAA-MM procedure needs to be performed for a UE, the AMF has not received the service -level device ID set to the CAA-level UAV ID in the Service-level-AA container IE of the REGISTRATION REQUEST message from the UE and the AMF decides to accept the UE to be registered for other services than UAS services based on the user's subscription data and the operator policy, the AMF shall accept the registration update request and shall mark in the UE's 5GMM context that the UE is not allowed to request UAS services.

If the UE supports MINT, the AMF may include the List of PLMNs to be used in disaster condition IE in the REGISTRATION ACCEPT message.

If the UE supports MINT, the AMF may include the Disaster roaming wait range IE in the REGISTRATION ACCEPT message.

If the UE supports MINT, the AMF may include the Disaster return wait range IE in the REGISTRATION ACCEPT message.

NOTE 6: The AMF can determine the content of the "list of PLMN(s) to be used in disaster condition", the value of the disaster roaming wait range and the value of the disaster return wait range based on the network local configuration.

If the AMF received the list of TAIs from the satellite NG-RAN as described in 3GPP TS 23.501 [8], and determines that, by UE subscription and operator's preferences, any but not all TAIs in the received list of TAIs is forbidden for roaming or for regional provision of service, the AMF shall include the TAI(s) in:

a) the Forbidden TAI(s) for the list of "5GS forbidden tracking areas for roaming" IE; or

b) the Forbidden TAI(s) for the list of "5GS forbidden tracking areas for regional provision of service" IE; or

c) both;

in the REGISTRATION ACCEPT message.

NOTE 7A: Void.

If the UE has set the Reconnection to the network due to RAN timing synchronization status change (RANtiming) bit to "Reconnection to the network due to RAN timing synchronization status change supported" in the 5GMM capability IE of the REGISTRATION REQUEST message, the AMF may include the RAN timing synchronization IE with the RecReq bit set to "Reconnection requested" in the REGISTRATION ACCEPT message.

If the AMF receives the mobility and periodic registration request along with along with the mobile IAB-indication over N2 reference point (see TS 38.413 [31]) from an UE and the UE is authorized to operate as an MBSR based on the subscription information and local policy (see 3GPP TS 23.501 [8]), the AMF shall include the Feature authorization indication IE in the REGISTRATION ACCEPT message and shall set the MBSRAI field to "authorized to operate as MBSR". If the AMF receives the mobility and periodic registration request along with along with the mobile IAB-indication over N2 reference point (see TS 38.413 [31]) from a UE and the UE is not authorized operate as an MBSR based on the subscription information and local policy but can operate as a UE, the AMF shall include the Feature authorization indication IE in the REGISTRATION ACCEPT message and shall set the MBSRAI field to "not authorized to operate as MBSR but allowed to operate as a UE".

If the UE supports user plane positioning using LCS-UPP, SUPL, or both, the AMF shall set the LCS-UPP bit, the SUPL bit, or both in the 5GS network feature support IE of the REGISTRATION ACCEPT message as specified in 3GPP TS 24.572 [64].

Upon receipt of the REGISTRATION ACCEPT message, the UE shall reset the registration attempt counter and service request attempt counter, enter state 5GMM-REGISTERED and set the 5GS update status to 5U1 UPDATED.

If the UE receives the REGISTRATION ACCEPT message from a PLMN, then the UE shall reset the PLMN-specific attempt counter for that PLMN for the specific access type for which the message was received. The UE shall also reset the PLMN-specific N1 mode attempt counter for that PLMN for the specific access type for which the message was received. If the message was received via 3GPP access, the UE shall reset the counter for "SIM/USIM considered invalid for GPRS services" events and the counter for "SIM/USIM considered invalid for non-GPRS services", if any. If the message was received via non-3GPP access, the UE shall reset the counter for "USIM considered invalid for 5GS services over non-3GPP" events.

If the UE receives the REGISTRATION ACCEPT message from an SNPN, then the UE shall reset the SNPN-specific attempt counter for the current SNPN for the specific access type for which the message was received. If the message was received via 3GPP access, the UE shall reset the counter for "the entry for the current SNPN considered invalid for 3GPP access" events. If the message was received via non-3GPP access, the UE shall reset the counter for "the entry for the current SNPN considered invalid for non-3GPP access" events.

If the REGISTRATION ACCEPT message included a T3512 value IE, the UE shall use the value in T3512 value IE as periodic registration update timer (T3512). If the T3512 value IE is not included, the UE shall use the value currently stored, e.g. from a prior REGISTRATION ACCEPT message.

If the REGISTRATION ACCEPT message include a T3324 value IE, the UE shall use the value in the T3324 value IE as active time timer (T3324). If the REGISTRATION ACCEPT message does not include a T3324 value IE, UE shall not start the timer T3324 until a new value is received from the network.

If the REGISTRATION ACCEPT message included a non-3GPP de-registration timer value IE, the UE shall use the value in non-3GPP de-registration timer value IE as non-3GPP de-registration timer. If non-3GPP de-registration timer value IE is not included, the UE shall use the value currently stored, e.g. from a prior REGISTRATION ACCEPT message. If non-3GPP de-registration timer value IE is not included and there is no stored non-3GPP de-registration timer value in the UE, the UE shall use the default value of the non-3GPP de-registration timer.

If the REGISTRATION ACCEPT message contains a 5G-GUTI, the UE shall return a REGISTRATION COMPLETE message to the AMF to acknowledge the received 5G-GUTI, stop timer T3519 if running, and delete any stored SUCI. The UE shall provide the 5G-GUTI to the lower layer of 3GPP access if the REGISTRATION ACCEPT message is sent over the non-3GPP access, and the UE is in 5GMM-REGISTERED in both 3GPP access and non-3GPP access in the same PLMN.

If the REGISTRATION ACCEPT message contains

a) the Network slicing indication IE with the Network slicing subscription change indication set to "Network slicing subscription changed";

b) a Configured NSSAI IE with a new configured NSSAI for the current PLMN or SNPN and optionally the mapped S-NSSAI(s) for the configured NSSAI for the current PLMN or SNPN;

c) an NSSRG information IE with a new NSSRG information;

d) an Alternative NSSAI IE with a new alternative NSSAI;

e) an S-NSSAI location validity information in the Registration accept type 6 IE container IE with a new S-NSSAI location validity information;

f) an S-NSSAI time validity information IE with a new S-NSSAI time validity information; or

g) an On-demand NSSAI IE with a new on-demand NSSAI or an updated slice deregistration inactivity timer value,

the UE shall return a REGISTRATION COMPLETE message to the AMF to acknowledge the successful update of the network slicing information. If the UE has set the RCMAN bit to "Sending of REGISTRATION COMPLETE message for NSAG information supported" in the 5GMM capability IE of the REGISTRATION REQUEST message and if REGISTRATION ACCEPT message contains the NSAG information IE, the UE shall return REGISTRATION COMPLETE message to the AMF to acknowledge the reception of the NSAG information IE.

NOTE 7B: When the UE receives the NSSRG information IE, the UE may provide the NSSRG information to lower layers for the purpose of NSAG-aware cell reselection.

If the REGISTRATION ACCEPT message contains the CAG information list IE or the Extended CAG information list IE and the UE had set the CAG bit to "CAG supported" in the 5GMM capability IE of the REGISTRATION REQUEST message, the UE shall:

a) replace the "CAG information list" stored in the UE with the received CAG information list IE or the Extended CAG information list IE when received in the HPLMN or EHPLMN;

b) replace the serving VPLMN's entry of the "CAG information list" stored in the UE with the serving VPLMN's entry of the received CAG information list IE or the Extended CAG information list IE when the UE receives the CAG information list IE or the Extended CAG information list IE in a serving PLMN other than the HPLMN or EHPLMN; or

NOTE 7: When the UE receives the CAG information list IE or the Extended CAG information list IE in a serving PLMN other than the HPLMN or EHPLMN, entries of a PLMN other than the serving VPLMN, if any, in the received CAG information list IE or the Extended CAG information list IE are ignored.

c) remove the serving VPLMN's entry of the "CAG information list" stored in the UE when the UE receives the CAG information list IE or the Extended CAG information list IE in a serving PLMN other than the HPLMN or EHPLMN and the CAG information list IE or the Extended CAG information list IE does not contain the serving VPLMN's entry.

The UE shall store the "CAG information list" received in the CAG information list IE or the Extended CAG information list IE as specified in annex C.

If the received "CAG information list" includes an entry containing the identity of the registered PLMN, the UE shall operate as follows.

a) if the UE receives the REGISTRATION ACCEPT message via a CAG cell,none of the CAG-ID(s) supported by the current CAG cell is authorized based on the "Allowed CAG list" of the entry for the registered PLMN in the received "CAG information list", and:

1) the entry for the registered PLMN in the received "CAG information list" does not include an "indication that the UE is only allowed to access 5GS via CAG cells", then the UE shall enter the state 5GMM-REGISTERED.LIMITED-SERVICE and shall search for a suitable cell according to 3GPP TS 38.304 [28] or 3GPP TS 36.304 [25C] with the updated "CAG information list"; or

2) the entry for the registered PLMN in the received "CAG information list" includes an "indication that the UE is only allowed to access 5GS via CAG cells" and:

i) if one or more CAG-ID(s) are authorized based on the "Allowed CAG list" of the entry for the registered PLMN in the received "CAG information list", the UE shall enter the state 5GMM-REGISTERED.LIMITED-SERVICE and shall search for a suitable cell according to 3GPP TS 38.304 [28] with the updated "CAG information list"; or

ii) if no CAG-ID is authorized based on the "Allowed CAG list" of the entry for the registered PLMN in the received "CAG information list" and:

A) the UE does not have an emergency PDU session, then the UE shall enter the state 5GMM-REGISTERED.PLMN-SEARCH and shall apply the PLMN selection process defined in 3GPP TS 23.122 [5] with the updated "CAG information list"; or

B) the UE has an emergency PDU session, then the UE shall perform a local release of all PDU sessions associated with 3GPP access except for the emergency PDU session and enter the state 5GMM-REGISTERED.LIMITED-SERVICE; or

b) if the UE receives the REGISTRATION ACCEPT message via a non-CAG cell and the entry for the registered PLMN in the received "CAG information list" includes an "indication that the UE is only allowed to access 5GS via CAG cells" and:

1) if one or more CAG-ID(s) are authorized based on the "allowed CAG list" for the registered PLMN in the received "CAG information list", the UE shall enter the state 5GMM-REGISTERED.LIMITED-SERVICE and shall search for a suitable cell according to 3GPP TS 38.304 [28] with the updated "CAG information list"; or

2) if no CAG-ID is authorized based on the "Allowed CAG list" of the entry for the registered PLMN in the received "CAG information list" and:

i) the UE does not have an emergency PDU session, then the UE shall enter the state 5GMM-REGISTERED.PLMN-SEARCH and shall apply the PLMN selection process defined in 3GPP TS 23.122 [5] with the updated "CAG information list"; or

ii) the UE has an emergency PDU session, then the UE shall perform a local release of all PDU sessions associated with 3GPP access except for the emergency PDU session and enter the state 5GMM-REGISTERED.LIMITED-SERVICE.

If the received "CAG information list" does not include an entry containing the identity of the registered PLMN and the UE receives the REGISTRATION ACCEPT message via a CAG cell, the UE shall enter the state 5GMM-REGISTERED.LIMITED-SERVICE and shall search for a suitable cell according to 3GPP TS 38.304 [28] or 3GPP TS 36.304 [25C] with the updated "CAG information list".

If the REGISTRATION ACCEPT message contains the Operator-defined access category definitions IE, the Extended emergency number list IE, the CAG information list IE or the Extended CAG information list IE, the UE shall return a REGISTRATION COMPLETE message to the AMF to acknowledge reception of the operator-defined access category definitions or the extended local emergency numbers list or the CAG information list.

If the UE has set the RCMAP bit to " Sending of REGISTRATION COMPLETE message for negotiated PEIPS assistance information supported " in the 5GMM capability IE of the REGISTRATION REQUEST message and if REGISTRATION ACCEPT message contains the Negotiated PEIPS assistance information IE, the UE shall return a REGISTRATION COMPLETE message to the AMF to acknowledge reception of the Negotiated PEIPS assistance information IE.

If the REGISTRATION ACCEPT message contains the UE radio capability ID IE or the UE radio capability ID deletion indication IE, the UE shall return a REGISTRATION COMPLETE message to the AMF to acknowledge reception of the UE radio capability ID IE or the UE radio capability ID deletion indication IE.

If the T3448 value IE is present in the received REGISTRATION ACCEPT message and the value indicates that this timer is neither zero nor deactivated, the UE shall:

a) stop timer T3448 if it is running; and

b) start timer T3448 with the value provided in the T3448 value IE.

If the UE is using 5GS services with control plane CIoT 5GS optimization, the T3448 value IE is present in the REGISTRATION ACCEPT message and the value indicates that this timer is either zero or deactivated, the UE shall ignore the T3448 value IE and proceed as if the T3448 value IE was not present.

If the UE in 5GMM-IDLE mode initiated the registration procedure for mobility and periodic registration update and the REGISTRATION ACCEPT message does not include the T3448 value IE and if timer T3448 is running, then the UE shall stop timer T3448.

Upon receiving a REGISTRATION COMPLETE message, the AMF shall stop timer T3550 and change to state 5GMM-REGISTERED. The 5G-GUTI, if sent in the REGISTRATION ACCEPT message, shall be considered as valid, the PEIPS assistance information, if sent in the REGISTRATION ACCEPT message, shall be considered as valid, and the UE radio capability ID, if sent in the REGISTRATION ACCEPT message, shall be considered as valid.

If the 5GS update type IE was included in the REGISTRATION REQUEST message with the SMS requested bit set to "SMS over NAS supported" and:

a) the SMSF address is stored in the UE 5GMM context and:

1) the UE is considered available for SMS over NAS; or

2) the UE is considered not available for SMS over NAS and the SMSF has confirmed that the activation of the SMS service is successful; or

b) the SMSF address is not stored in the UE 5GMM context, the SMSF selection is successful and the SMSF has confirmed that the activation of the SMS service is successful;

then the AMF shall set the SMS allowed bit of the 5GS registration result IE in the REGISTRATION ACCEPT message as specified in subclause 5.5.1.2.4. If the UE 5GMM context does not contain an SMSF address or the UE is not considered available for SMS over NAS, then the AMF shall:

a) store the SMSF address in the UE 5GMM context if not stored already; and

b) store the value of the SMS allowed bit of the 5GS registration result IE in the UE 5GMM context and consider the UE available for SMS over NAS.

If SMSF selection in the AMF or SMS activation via the SMSF is not successful, or the AMF does not allow the use of SMS over NAS, then the AMF shall set the SMS allowed bit of the 5GS registration result IE to "SMS over NAS not allowed" in the REGISTRATION ACCEPT message.

If the 5GS update type IE was included in the REGISTRATION REQUEST message with the SMS requested bit set to "SMS over NAS not supported" or the 5GS update type IE was not included in the REGISTRATION REQUEST message, then the AMF shall:

a) mark the 5GMM context to indicate that the UE is not available for SMS over NAS; and

NOTE 8: The AMF can notify the SMSF that the UE is deregistered from SMS over NAS based on local configuration.

b) set the SMS allowed bit of the 5GS registration result IE to "SMS over NAS not allowed" in the REGISTRATION ACCEPT message.

When the UE receives the REGISTRATION ACCEPT message, if the UE is also registered over another access to the same PLMN, the UE considers the value indicated by the SMS allowed bit of the 5GS registration result IE as applicable for both accesses over which the UE is registered.

If the 5GS update type IE was included in the REGISTRATION REQUEST message with the NG-RAN-RCU bit set to "UE radio capability update needed", the AMF shall delete the stored UE radio capability information or the UE radio capability ID, if any.

The AMF shall include the 5GS registration result IE in the REGISTRATION ACCEPT message. If the 5GS registration result value in the 5GS registration result IE indicates:

a) "3GPP access", the UE:

1) shall consider itself as being registered to 3GPP access; and

2) if in 5GMM-REGISTERED state over non-3GPP access and on the same PLMN or SNPN as 3GPP access, shall enter state 5GMM-DEREGISTERED.ATTEMPTING-REGISTRATION over non-3GPP access and set the 5GS update status to 5U2 NOT UPDATED over non-3GPP access; or

b) "Non-3GPP access", the UE:

1) shall consider itself as being registered to non-3GPP access; and

2) if in the 5GMM-REGISTERED state over 3GPP access and is on the same PLMN or SNPN as non-3GPP access, shall enter the state 5GMM-DEREGISTERED.ATTEMPTING-REGISTRATION over 3GPP access and set the 5GS update status to 5U2 NOT UPDATED over 3GPP access; or

c) "3GPP access and non-3GPP access", the UE shall consider itself as being registered to both 3GPP access and non-3GPP access.

If the UE is not currently registered for emergency services and the emergency registered bit of the 5GS registration result IE in the REGISTRATION ACCEPT message is set to "Registered for emergency services", the UE shall consider itself registered for emergency services and shall locally release all non-emergency PDU sessions, if any.

In roaming scenarios, the AMF shall provide mapped S-NSSAI(s) for the configured NSSAI, the allowed NSSAI, the partially allowed NSSAI, the rejected NSSAI (if Extended rejected NSSAI IE is used), the partially rejected NSSAI, the pending NSSAI or NSSRG information when included in the REGISTRATION ACCEPT message.

The AMF shall include the allowed NSSAI for the current PLMN or SNPN, in roaming scenarios, and shall include the mapped S-NSSAI(s) for the allowed NSSAI contained in the requested NSSAI (i.e. Requested NSSAI IE or Requested mapped NSSAI IE) from the UE, in the REGISTRATION ACCEPT message if the UE included the requested NSSAI in the REGISTRATION REQUEST message and the AMF allows one or more S-NSSAIs for the current PLMN or SNPN in the Requested NSSAI IE or one or more mapped S-NSSAIs in the Requested NSSAI IE or Requested mapped NSSAI IE. Additionally, if the AMF allows one or more subscribed S-NSSAIs for the UE, the AMF may include the allowed subscribed S-NSSAI(s) in the allowed NSSAI in the REGISTRATION ACCEPT message. The S-NSSAI associated with each of the active PDN connections for which interworking to 5GS is supported, shall be included in the allowed NSSAI if the UE included the UE status IE with the EMM registration status set to "UE is in EMM-REGISTERED state" in the REGISTRATION REQUEST message and the AMF supports N26 interface.

The AMF may also include rejected NSSAI in the REGISTRATION ACCEPT message if the UE is not registered for onboarding services in SNPN. If the UE has set the ER-NSSAI bit to "Extended rejected NSSAI supported" in the 5GMM capability IE of the REGISTRATION REQUEST message, the rejected NSSAI shall be included in the Extended rejected NSSAI IE in the REGISTRATION ACCEPT message; otherwise the rejected NSSAI shall be included in the Rejected NSSAI IE in the REGISTRATION ACCEPT message. If the UE is registered for onboarding services in SNPN, the AMF shall not include rejected NSSAI in the REGISTRATION ACCEPT message.

If the UE has indicated the support for partial network slice and the AMF determines one or more S-NSSAI(s) in the requested NSSAI are to be included in the partially rejected NSSAI as specified in subclause 4.6.2.11, the AMF shall include the Partially rejected NSSAI IE in the Registration accept type 6 IE container IE of the REGISTRATION ACCEPT message.

If the UE receives the Partially rejected NSSAI IE in the Registration accept type 6 IE container IE of the REGISTRATION ACCEPT message, the UE shall store the partially rejected NSSAI as specified in subclause 4.6.2.2.

If the UE has set the ER-NSSAI bit to "Extended rejected NSSAI supported" in the 5GMM capability IE of the REGISTRATION REQUEST message, the rejected NSSAI contains S-NSSAI(s) which was included in the requested NSSAI but rejected by the network associated with rejection cause(s); otherwise the rejected NSSAI contains S-NSSAI(s) which was included in the requested NSSAI but rejected by the network associated with rejection cause(s) with the following restrictions:

a) rejected NSSAI for the current PLMN or SNPN shall not include an S-NSSAI for the current PLMN or SNPN which is associated to multiple mapped S-NSSAIs and some of these but not all mapped S-NSSAIs are not allowed; and

b) rejected NSSAI for the current registration area shall not include an S-NSSAI for the current PLMN or SNPN which is associated to multiple mapped S-NSSAIs and some of these but not all mapped S-NSSAIs are not allowed.

NOTE 9: The UE that does not support extended rejected NSSAI can avoid requesting an S-NSSAI associated with a mapped S-NSSAI, which was included in the previous requested NSSAI but neither in the allowed NSSAI nor in the rejected NSSAI in the consequent registration procedures.

If the UE indicated the support for network slice-specific authentication and authorization, and if the requested NSSAI (i.e. the Requested NSSAI IE or the Requested mapped NSSAI IE) includes one or more S-NSSAIs subject to network slice-specific authentication and authorization, the AMF shall in the REGISTRATION ACCEPT message include:

a) the allowed NSSAI containing the S-NSSAI(s) or the mapped S-NSSAI(s), if any:

1) which are not subject to network slice-specific authentication and authorization and are allowed by the AMF; or

2) for which the network slice-specific authentication and authorization has been successfully performed;

aa) the partially allowed NSSAI containing the S-NSSAI(s) or the mapped S-NSSAI(s), if any:

1) which are not subject to network slice-specific authentication and authorization and are allowed by the AMF; or

2) for which the network slice-specific authentication and authorization has been successfully performed;

b) optionally, the rejected NSSAI;

ba) optionally, the partially rejected NSSAI;

c) pending NSSAI containing one or more S-NSSAIs for which network slice-specific authentication and authorization (except for re-NSSAA) will be performed or is ongoing, and one or more S-NSSAIs from the pending NSSAI which the AMF provided to the UE during the previous registration procedure for which network slice-specific authentication and authorization will be performed or is ongoing, if any; and

d) the "NSSAA to be performed" indicator in the 5GS registration result IE set to indicate that the network slice-specific authentication and authorization procedure will be performed by the network, if the allowed NSSAI is not included in the REGISTRATION ACCEPT message.

If the UE is not registered for onboarding services in SNPN, the UE indicated the support for network slice-specific authentication and authorization, and:

a) the UE did not include the requested NSSAI in the REGISTRATION REQUEST message or none of the S-NSSAIs in the requested NSSAI in the REGISTRATION REQUEST message are allowed;

b) all default S-NSSAIs are subject to network slice-specific authentication and authorization; and

c) the network slice-specific authentication and authorization procedure has not been successfully performed for any of the default S-NSSAIs,

the AMF shall in the REGISTRATION ACCEPT message include:

a) the "NSSAA to be performed" indicator in the 5GS registration result IE to indicate that the network slice-specific authentication and authorization procedure will be performed by the network; and

b) pending NSSAI containing one or more default S-NSSAIs for which network slice-specific authentication and authorization will be performed or is ongoing and one or more S-NSSAIs from the pending NSSAI which the AMF provided to the UE during the previous registration procedure for which network slice-specific authentication and authorization will be performed or is ongoing (if any); and

c) optionally, the rejected NSSAI.

If the UE is not registered for onboarding services in SNPN, the UE indicated the support for network slice-specific authentication and authorization, and:

a) the UE did not include the requested NSSAI in the REGISTRATION REQUEST message or none of the S-NSSAIs in the requested NSSAI in the REGISTRATION REQUEST message are allowed; and

b) one or more default S-NSSAIs are not subject to network slice-specific authentication and authorization or the network slice-specific authentication and authorization procedure has been successfully performed for one or more default S-NSSAIs;

the AMF shall in the REGISTRATION ACCEPT message include:

a) pending NSSAI containing one or more default S-NSSAIs for which network slice-specific authentication and authorization will be performed or is ongoing (if any) and one or more S-NSSAIs from the pending NSSAI which the AMF provided to the UE during the previous registration procedure for which network slice-specific authentication and authorization will be performed or is ongoing (if any);

b) allowed NSSAI containing S-NSSAI(s) for the current PLMN or SNPN each of which corresponds to a default S-NSSAI which are not subject to network slice-specific authentication and authorization or for which the network slice-specific authentication and authorization has been successfully performed;

c) allowed NSSAI containing one or more default S-NSSAIs, as the mapped S-NSSAI(s) for the allowed NSSAI in roaming scenarios, which are not subject to network slice-specific authentication and authorization or for which the network slice-specific authentication and authorization has been successfully performed; and

d) optionally, the rejected NSSAI; and

e) optionally, the partially rejected NSSAI.

If the UE did not include the requested NSSAI in the REGISTRATION REQUEST message or none of the S-NSSAIs in the requested NSSAI in the REGISTRATION REQUEST message are allowed, the allowed NSSAI shall not contain default S-NSSAI(s) that are subject to NSAC. If the subscription information includes the NSSRG information, the S-NSSAIs of the allowed NSSAI shall be associated with at least one common NSSRG value. If the network has pending NSSAI, the S-NSSAIs in the pending NSSAI and allowed NSSAI shall be associated with at least one common NSSRG value.

When the REGISTRATION ACCEPT includes a pending NSSAI, the pending NSSAI shall contain all S-NSSAIs for which network slice-specific authentication and authorization (except for re-NSSAA) will be performed or is ongoing from the requested NSSAI of the REGISTRATION REQUEST message that was received over the 3GPP access, non-3GPP access, or both the 3GPP access and non-3GPP access.

If the UE supports extended rejected NSSAI and the AMF determines that maximum number of UEs reached for all S-NSSAIs in the requested NSSAI as specified in subclause 4.6.2.5, the AMF shall include the rejected NSSAI containing one or more S-NSSAIs with the rejection cause "S-NSSAI not available due to maximum number of UEs reached" in the Extended rejected NSSAI IE in the REGISTRATION ACCEPT message. In addition, the AMF may include a back-off timer value for each S-NSSAI with the rejection cause "S-NSSAI not available due to maximum number of UEs reached" included in the Extended rejected NSSAI IE of the REGISTRATION ACCEPT message. To avoid that large numbers of UEs simultaneously initiate deferred requests, the network should select the value for the backoff timer for each S-NSSAI for the informed UEs so that timeouts are not synchronised.

If the UE does not indicate support for extended rejected NSSAI and the maximum number of UEs has been reached, the AMF should include the rejected NSSAI containing one or more S-NSSAIs with the rejection cause "S-NSSAI not available in the current registration area" in the Rejected NSSAI IE and should not include these S-NSSAIs in the allowed NSSAI in the REGISTRATION ACCEPT message.

NOTE 10: Based on network policies, the AMF can include the S-NSSAI(s) for which the maximum number of UEs has been reached in the rejected NSSAI with rejection causes other than "S-NSSAI not available in the current registration area".

If the UE indicates support for network slice usage control and the AMF determines to provide the on-demand NSSAI, the AMF shall include the On-demand NSSAI IE in the REGISTRATION ACCEPT message. In addition, the AMF shall start timer T3550 and enter state 5GMM-COMMON-PROCEDURE-INITIATED as described in subclause 5.1.3.2.3.3.

If the AMF has a new configured NSSAI for the current PLMN or SNPN, the AMF shall include the configured NSSAI for the current PLMN or SNPN in the REGISTRATION ACCEPT message.

NOTE 10A: A new configured NSSAI can be available at the AMF following an indication that the subscription data for network slicing has changed.

The AMF may include a new configured NSSAI for the current PLMN or SNPN in the REGISTRATION ACCEPT message if:

a) the REGISTRATION REQUEST message did not include a requested NSSAI and the UE is not registered for onboarding services in SNPN;

b) the REGISTRATION REQUEST message included a requested NSSAI containing an S-NSSAI that is not valid in the serving PLMN or SNPN;

c) the REGISTRATION REQUEST message included a requested NSSAI containing an S-NSSAI with incorrect mapped S-NSSAI(s);

d) the REGISTRATION REQUEST message included the Network slicing indication IE with the Default configured NSSAI indication bit set to "Requested NSSAI created from default configured NSSAI";

e) the REGISTRATION REQUEST message included the requested mapped NSSAI;

f) the S-NSSAIs of the requested NSSAI in the REGISTRATION REQUEST message are not associated with any common NSSRG value, except for the case that the AMF, based on the indication received from the UDM as specified in 3GPP TS 23.501 [8], has provided all subscribed S-NSSAIs in the configured NSSAI to a UE who does not support NSSRG;

NOTE 11: If the S-NSSAIs of the requested NSSAI in the REGISTRATION REQUEST message are not associated with any common NSSRG value, it is possible that at least one of the S-NSSAIs is not included in any of new allowed NSSAI, new (extended) rejected NSSAI (if applicable), and new pending NSSAI (if applicable).

g) the UE is in 5GMM-REGISTERED state over the other access and the S-NSSAIs of the requested NSSAI in the REGISTRATION REQUEST message over the current access and the allowed NSSAI over the other access are not associated with any common NSSRG value;

h) the REGISTRATION REQUEST message included a 5GS mobile identity IE containing a mapped 5G-GUTI and did not include an Additional GUTI IE; or

i) the REGISTRATION REQUEST message included an Additional GUTI IE containing a valid native 5G-GUTI which was not allocated by the current PLMN or SNPN.

The AMF may include a new configured NSSAI for the current PLMN or SNPN in the REGISTRATION ACCEPT message if the REGISTRATION REQUEST message includes a requested NSSAI containing an S-NSSAI and the S-NSSAI time validity information, if available, indicates that the S-NSSAI is not available (see 3GPP TS 23.501 [8]). In this case, if the TempNS bit of the 5GMM capability IE in the REGISTRATION REQUEST message is set to:

a) "S-NSSAI time validity information supported" and the S-NSSAI time validity information indicates that the S-NSSAI will:

1) become available again, then the AMF shall also send S-NSSAI time validity information; or

2) not become available again, then the AMF shall not include the S-NSSAI in the new configured NSSAI; or

b) "S-NSSAI time validity information not supported" and the AMF sends a new configured NSSAI, then the AMF shall not include the S-NSSAI in the new configured NSSAI.

If a new configured NSSAI for the current PLMN or SNPN is included and the UE is roaming, the AMF shall also include the mapped S-NSSAI(s) for the configured NSSAI for the current PLMN or SNPN in the REGISTRATION ACCEPT message. In this case the AMF shall start timer T3550 and enter state 5GMM-COMMON-PROCEDURE-INITIATED as described in subclause 5.1.3.2.3.3.

If a new configured NSSAI for the current PLMN or SNPN is included, the subscription information includes the NSSRG information, and the NSSRG bit in the 5GMM capability IE of the REGISTRATION REQUEST message is set to:

a) "NSSRG supported", then the AMF shall include the NSSRG information in the REGISTRATION ACCEPT message; or

b) "NSSRG not supported", then the configured NSSAI shall include S-NSSAIs each of which is associated with all the NSSRG value(s) of the default S-NSSAI(s), or the configured NSSAI shall include, based on the indication received from the UDM as specified in 3GPP TS 23.501 [8], all subscribed S-NSSAIs even if these S-NSSAIs do not share any common NSSRG value.

If the AMF needs to update the NSSRG information and the UE has set the NSSRG bit to "NSSRG supported" in the 5GMM capability IE of the REGISTRATION REQUEST message, then the AMF shall include the new NSSRG information in the REGISTRATION ACCEPT message. In addition, the AMF shall start timer T3550 and enter state 5GMM-COMMON-PROCEDURE-INITIATED as described in subclause 5.1.3.2.3.3.

If the UE supports S-NSSAI time validity information and the AMF needs to update the S-NSSAI time validity information, then the AMF shall include the S-NSSAI time validity information IE in the REGISTRATION ACCEPT message. In addition, the AMF shall start timer T3550 and enter state 5GMM-COMMON-PROCEDURE-INITIATED as described in subclause 5.1.3.2.3.3.

If the UE supports S-NSSAI location validity information and the AMF needs to update the S-NSSAI location validity information, then the AMF shall include the S-NSSAI location validity information IE in the Registration accept type 6 IE container IE of the REGISTRATION ACCEPT message. In addition, the AMF shall start timer T3550 and enter state 5GMM-COMMON-PROCEDURE-INITIATED as described in subclause 5.1.3.2.3.3.

The AMF shall include the Network slicing indication IE with the Network slicing subscription change indication set to "Network slicing subscription changed" in the REGISTRATION ACCEPT message if the UDM has indicated that the subscription data for network slicing has changed. In this case the AMF shall start timer T3550 and enter state 5GMM-COMMON-PROCEDURE-INITIATED as described in subclause 5.1.3.2.3.3.

If the S-NSSAI(s) associated with the existing PDU session(s) of the UE is not included in the requested NSSAI (i.e. Requested NSSAI IE or Requested mapped NSSAI IE) of the REGISTRATION REQUEST message, the AMF shall perform a local release of the PDU session(s) associated with the S-NSSAI(s) except for a PDU session associated with DNN and S-NSSAI in the AMF onboarding configuration data and shall request the SMF to perform a local release of those PDU session(s).

The UE that has indicated the support for network slice-specific authentication and authorization receiving the pending NSSAI in the REGISTRATION ACCEPT message shall store the S-NSSAI(s) in the pending NSSAI as specified in subclause 4.6.2.2. If the registration area contains TAIs belonging to different PLMNs, which are equivalent PLMNs, the UE shall store the received pending NSSAI for each of the equivalent PLMNs as specified in subclause 4.6.2.2. If the pending NSSAI is not included in the REGISTRATION ACCEPT message and the "NSSAA to be performed" indicator is not set to "Network slice-specific authentication and authorization is to be performed" in the 5GS registration result IE of the REGISTRATION ACCEPT message, then the UE shall delete the pending NSSAI for the current PLMN and its equivalent PLMN(s) or SNPN, if existing, as specified in subclause 4.6.2.2.

The UE receiving the rejected NSSAI in the REGISTRATION ACCEPT message takes the following actions based on the rejection cause in the rejected S-NSSAI(s):

"S-NSSAI not available in the current PLMN or SNPN"

The UE shall add the rejected S-NSSAI(s) in the rejected NSSAI for the current PLMN or SNPN as specified in subclause 4.6.2.2 and shall not attempt to use this S-NSSAI(s) in the current PLMN or SNPN over any access until switching off the UE, the UICC containing the USIM is removed, the entry of the "list of subscriber data" with the SNPN identity of the current SNPN is updated, or the rejected S-NSSAI(s) are removed as described in subclause 4.6.2.2.

"S-NSSAI not available in the current registration area"

The UE shall add the rejected S-NSSAI(s) in the rejected NSSAI for the current registration area as specified in subclause 4.6.2.2 and shall not attempt to use this S-NSSAI(s) in the current registration area over the current until switching off the UE, the UE moving out of the current registration area, the UICC containing the USIM is removed, the entry of the "list of subscriber data" with the SNPN identity of the current SNPN is updated, or the rejected S-NSSAI(s) are removed as described in subclause 4.6.2.2.

"S-NSSAI not available due to the failed or revoked network slice-specific authentication and authorization"

The UE shall store the rejected S-NSSAI(s) in the rejected NSSAI for the failed or revoked NSSAA as specified in subclause 4.6.2.2 and shall not attempt to use this S-NSSAI in the current PLMN or SNPN over any access until switching off the UE, the UICC containing the USIM is removed, the entry of the "list of subscriber data" with the SNPN identity of the current SNPN is updated, or the rejected S-NSSAI(s) are removed as described in subclause 4.6.1 and 4.6.2.2.

"S-NSSAI not available due to maximum number of UEs reached"

Unless the back-off timer value received along with the S-NSSAI is zero, the UE shall add the rejected S-NSSAI(s) in the rejected NSSAI for the maximum number of UEs reached as specified in subclause 4.6.2.2 and shall not attempt to use this S-NSSAI in the current PLMN or SNPN over the current access until switching off the UE, the UICC containing the USIM is removed, the entry of the "list of subscriber data" with the SNPN identity of the current SNPN is updated, or the rejected S-NSSAI(s) are removed as described in subclauses 4.6.1 and 4.6.2.2.

NOTE 12: If the back-off timer value received along with the S-NSSAI in the rejected NSSAI for the maximum number of UEs reached is zero as specified in subclause 10.5.7.4a of 3GPP TS 24.008 [12], the UE does not consider the S-NSSAI as the rejected S-NSSAI.

If there is one or more S-NSSAIs in the rejected NSSAI with the rejection cause "S-NSSAI not available due to maximum number of UEs reached", then for each S-NSSAI, the UE shall behave as follows:

a) stop the timer T3526 associated with the S-NSSAI, if running;

b) start the timer T3526 with:

1) the back-off timer value received along with the S-NSSAI, if a back-off timer value is received along with the S-NSSAI that is neither zero nor deactivated; or

2) an implementation specific back-off timer value, if no back-off timer value is received along with the S-NSSAI; and

c) remove the S-NSSAI from the rejected NSSAI for the maximum number of UEs reached when the timer T3526 associated with the S-NSSAI expires.

If the UE sets the NSSAA bit in the 5GMM capability IE to "Network slice-specific authentication and authorization not supported", and:

a) if the Requested NSSAI IE only includes the S-NSSAI(s) subject to network slice-specific authentication and authorization and one or more default S-NSSAIs (containing one or more S-NSSAIs each of which may be associated with a new S-NSSAI) which are not subject to network slice-specific authentication and authorization are available, the AMF shall in the REGISTRATION ACCEPT message include:

1) the allowed NSSAI or the partially allowed NSSAI containing S-NSSAI(s) for the current PLMN or SNPN each of which corresponds to a default S-NSSAI which are not subject to network slice-specific authentication and authorization;

2) the allowed NSSAI or the partially allowed NSSAI containing the default S-NSSAIs, as the mapped S-NSSAI(s) for the allowed NSSAI in roaming scenarios, which are not subject to network slice-specific authentication and authorization; and

3) the rejected NSSAI containing the S-NSSAI(s) subject to network slice specific authentication and authorization with the rejection cause indicating "S-NSSAI not available in the current PLMN or SNPN", except if the UE has not set the ER-NSSAI bit to "Extended rejected NSSAI supported" in the 5GMM capability IE of the REGISTRATION REQUEST message and the S-NSSAI(s) is associated to multiple mapped S-NSSAIs and some of these but not all mapped S-NSSAIs are subject to NSSAA; or

b) if the Requested NSSAI IE includes one or more S-NSSAIs subject to network slice-specific authentication and authorization, the AMF shall in the REGISTRATION ACCEPT message include:

1) the allowed NSSAI or the partially allowed NSSAI containing the S-NSSAI(s) or the mapped S-NSSAI(s) which are not subject to network slice-specific authentication and authorization; and

2) the rejected NSSAI containing:

i) the S-NSSAI(s) subject to network slice specific authentication and authorization with the rejection cause indicating "S-NSSAI not available in the current PLMN or SNPN", except if the UE has not set the ER-NSSAI bit to "Extended rejected NSSAI supported" in the 5GMM capability IE of the REGISTRATION REQUEST message and the S-NSSAI(s) is associated to multiple mapped S-NSSAIs and some of these but not all mapped S-NSSAIs are subject to NSSAA; and

ii) the S-NSSAI(s) which was included in the requested NSSAI but rejected by the network associated with the rejection cause indicating "S-NSSAI not available in the current PLMN or SNPN" or the rejection cause indicating "S-NSSAI not available in the current registration area", if any.

For a REGISTRATION REQUEST message with a 5GS registration type IE indicating "mobility registration updating", if the UE does not indicate support for network slice-specific authentication and authorization, the UE is not registered for onboarding services in SNPN, and:

a) the UE is not in NB-N1 mode; and

b) if:

1) the UE did not include the requested NSSAI in the REGISTRATION REQUEST message; or

2) none of the S-NSSAIs in the requested NSSAI in the REGISTRATION REQUEST message are allowed;

and one or more default S-NSSAIs which are not subject to network slice-specific authentication and authorization are available, the AMF shall:

a) put the allowed S-NSSAI(s) for the current PLMN or SNPN each of which corresponds to a default S-NSSAI and not subject to network slice-specific authentication and authorization in the allowed NSSAI of the REGISTRATION ACCEPT message;

b) put the default S-NSSAIs and not subject to network slice-specific authentication and authorization, as the mapped S-NSSAI(s) for the allowed NSSAI in roaming scenarios, in the allowed NSSAI of the REGISTRATION ACCEPT message; and

c) determine a registration area such that all S-NSSAIs of the allowed NSSAI are available in the registration area.

During a registration procedure for mobility and periodic registration update for which the 5GS registration type IE indicates:

a) "periodic registration updating"; or

b) "mobility registration updating" and the UE is in NB-N1 mode;

and the UE is not registered for onboarding services in SNPN, the AMF:

a) may provide a new allowed NSSAI, a new partially allowed NSSAI, or both to the UE;

b) shall provide a pending NSSAI to the UE if the UE has indicated the support for network slice-specific authentication and authorization and there are S-NSSAIs for which network slice-specific authentication and authorization (except for re-NSSAA) will be performed or is ongoing for the current PLMN or SNPN; or

c) may provide both a new allowed NSSAI and a pending NSSAI to the UE;

in the REGISTRATION ACCEPT message. Additionally, if a pending NSSAI is provided without an allowed NSSAI and no S-NSSAI is currently allowed for the UE, the REGISTRATION ACCEPT message shall include the 5GS registration result IE with the "NSSAA to be performed" indicator set to "Network slice-specific authentication and authorization is to be performed".

If the REGISTRATION ACCEPT message contains the Network slicing indication IE with the Network slicing subscription change indication set to "Network slicing subscription changed", the UE shall delete the network slicing information and the NSSAI inclusion mode for each and every PLMN or SNPN except for the current PLMN or SNPN as specified in subclause 4.6.2.2 and remove all tracking areas from the list of "5GS forbidden tracking areas for roaming" which were added due to rejection of S-NSSAI due to "S-NSSAI not available in the current registration area".

If the REGISTRATION ACCEPT message contains the allowed NSSAI, then the UE shall store the included allowed NSSAI together with the PLMN identity of the registered PLMN or the SNPN identity of the registered SNPN and the registration area as specified in subclause 4.6.2.2. If the registration area contains TAIs belonging to different PLMNs, which are equivalent PLMNs, the UE shall store the received allowed NSSAI in each of allowed NSSAIs which are associated with each of the PLMNs.

For each of the PDU session(s) active in the UE:

a) if the allowed NSSAI contains an HPLMN S-NSSAI (e.g., mapped S-NSSAI, in roaming scenarios) matching to the HPLMN S-NSSAI of the PDU session, the UE shall locally update the S-NSSAI associated with the PDU session to the corresponding S-NSSAI received in the allowed NSSAI;

b) if the allowed NSSAI does not contain an HPLMN S-NSSAI (e.g., mapped S-NSSAI, in roaming scenarios) matching to the HPLMN S-NSSAI of the PDU session, the UE may perform a local release of the PDU session except for an emergency PDU session, if any, and except for a PDU session established when the UE is registered for onboarding services in SNPN, if any; and

c) if the partially allowed NSSAI contains an S-NSSAI associated with a PDU session, and the UE is in the TA where the S-NSSAI is not supported:

1) the UE may initiate:

i) the PDU session release procedure; or

ii) the PDU session modification procedure to set the 3GPP PS data off status to "deactivated" as specified in 3GPP TS 24.008 [13]; and

2) the SMF may initiate the PDU session release procedure.

NOTE 13: According to 3GPP TS 23.501 [8], also the AMF will determine which PDU sessions can no longer be supported based on the new allowed NSSAI, and it will cause a release on the UE side either by indicating in the PDU session status IE which PDU sessions are inactive on the network side or by triggering the SMF to initiate a release via 5GSM signalling.

NOTE 13AA: If a dedicated S-NSSAI for MWAB is not included in the new allowed NSSAI, then the AMF can decide not to indicate in the PDU session status IE a PDU session associated with the S-NSSAI and DNN combination for MWAB as inactive on the network side, and to delay the notification of the SMF associated with the PDU session to initiate the network-requested PDU session release procedure for a locally configured time.

If the REGISTRATION ACCEPT message contains a configured NSSAI IE with a new configured NSSAI for the current PLMN or SNPN and optionally the mapped S-NSSAI(s) for the configured NSSAI for the current PLMN or SNPN, the UE shall store the contents of the configured NSSAI IE as specified in subclause 4.6.2.2. In addition, if the REGISTRATION ACCEPT message contains:

a) an NSSRG information IE, the UE shall store the contents of the NSSRG information IE as specified in subclause 4.6.2.2. If the UE receives a Configured NSSAI IE in the REGISTRATION ACCEPT message and no NSSRG information IE, the UE shall delete any stored NSSRG information, if any, as specified in subclause 4.6.2.2;

b) an S-NSSAI location validity information IE in the Registration accept type 6 IE container IE, the UE shall store the contents of the S-NSSAI location validity information as specified in subclause 4.6.2.2. If the UE receives a Configured NSSAI IE in the REGISTRATION ACCEPT message and no S-NSSAI location validity information IE, the UE shall delete any stored S-NSSAI location validity information as specified in subclause 4.6.2.2;

c) an S-NSSAI time validity information IE, the UE shall store the contents of the S-NSSAI time validity information IE as specified in subclause 4.6.2.2. If the UE receives a Configured NSSAI IE in the REGISTRATION ACCEPT message and no S-NSSAI time validity information IE, the UE shall delete any stored S-NSSAI time validity information as specified in subclause 4.6.2.2; or

d) an On-demand NSSAI IE, the UE shall store the contents of the On-demand NSSAI IE as specified in subclause 4.6.2.2. If the UE receives a Configured NSSAI IE in the REGISTRATION ACCEPT message and no On-demand NSSAI IE, the UE shall delete any stored on-demand NSSAI as specified in subclause 4.6.2.2. The UE shall stop any slice deregistration inactivity timer associated with an S-NSSAI which is deleted from the on-demand NSSAI.

If the UE has set the NSAG bit to "NSAG supported" in the 5GMM capability IE of the REGISTRATION REQUEST message over 3GPP access, the AMF may include the NSAG information IE in the REGISTRATION ACCEPT message. Up to 4 NSAG entries are allowed to be associated with a TAI list in the NSAG information IE. If the UE has set the RCMAN bit to "Sending of REGISTRATION COMPLETE message for NSAG information supported" in the 5GMM capability IE of the REGISTRATION REQUEST message and if the NSAG information IE is included in the REGISTRATION ACCEPT message, the AMF shall start timer T3550 and enter state 5GMM-COMMON-PROCEDURE-INITIATED as described in subclause 5.1.3.2.3.3.

NOTE 13A: How the AMF selects NSAG entries to be included in the NSAG information IE is implementation specific, e.g. take the NSAG priority and the current registration area into account.

NOTE 13B: If the NSAG for the PLMN and its equivalent PLMN(s) have different associations with S-NSSAIs, then the AMF includes a TAI list for the NSAG entry in the NSAG information IE.

NOTE 13C: If the NSAG for the PLMN and its equivalent PLMN(s) have different associations with S-NSSAIs, then the AMF includes a TAI list for the NSAG entry in the NSAG information IE.

If the UE receives the NSAG information IE in the REGISTRATION ACCEPT message, the UE shall store the NSAG information as specified in subclause 4.6.2.2.

If the UE supports network slice replacement and the AMF determines to provide the mapping information between the S-NSSAI to be replaced and the alternative S-NSSAI to the UE, then the AMF shall include the Alternative NSSAI IE, the Allowed NSSAI IE including the alternative S-NSSAI, if not included in the current allowed NSSAI, and the Configured NSSAI IE including the alternative S-NSSAI, if not included in the current configured NSSAI, in the REGISTRATION ACCEPT message. If the AMF determines that the replaced S-NSSAI is available, then the AMF shall provide the updated alternative NSSAI excluding the replaced S-NSSAI and the corresponding alternative S-NSSAI in the Alternative NSSAI IE in the REGISTRATION ACCEPT message. If the AMF determines that all the replaced S-NSSAI(s) are available, then the AMF shall provide the Alternative NSSAI IE with Length of Alternative NSSAI contents set to 0 in the REGISTRATION ACCEPT message. If the AMF determines that the replaced S-NSSAI is not supported due to the UE moving outside of NS-AoS of the S-NSSAI while the alternative S-NSSAI is available, then the AMF shall provide the updated allowed NSSAI and partially allowed NSSAI, if available, excluding the replaced S-NSSAI, if included, in the allowed NSSAI or partially allowed NSSAI in the REGISTRATION ACCEPT message. In addition, the AMF shall start timer T3550 and enter state 5GMM-COMMON-PROCEDURE-INITIATED as described in subclause 5.1.3.2.3.3.

If the UE receives the Alternative NSSAI IE in the REGISTRATION ACCEPT message, the UE shall store the alternative NSSAI as specified in subclause 4.6.2.2.

If the UE has indicated the support for partial network slice and the AMF determines one or more S-NSSAI(s) in the requested NSSAI are to be included in the partially allowed NSSAI as specified in subclause 4.6.2.11, the AMF shall include the Partially allowed NSSAI IE in the Registration accept type 6 IE container IE of the REGISTRATION ACCEPT message.

If the UE receives the Partially allowed NSSAI IE in the Registration accept type 6 IE container IE of the REGISTRATION ACCEPT message, the UE shall store the partially allowed NSSAI as specified in subclause 4.6.2.2.

If the REGISTRATION ACCEPT message:

a) includes the 5GS registration result IE with the "NSSAA to be performed" indicator set to "Network slice-specific authentication and authorization is to be performed";

b) includes a pending NSSAI;

c) does not include an allowed NSSAI; and

d) does not include a partially allowed NSSAI;

the UE:

a) shall not perform the registration procedure for mobility and periodic registration update with the Uplink data status IE except for emergency services;

b) shall not initiate a service request procedure except for emergency services, for emergency services fallback procedure, for responding to paging or notification over non-3GPP access, for cases f), i), m) and o) in subclause 5.6.1.1;

c) shall not initiate a 5GSM procedure except for emergency services, indicating a change of 3GPP PS data off UE status, or to request the release of a PDU session; and

d) shall not initiate the NAS transport procedure except for sending a CIoT user data container, SMS, an LPP message, a UPP-CMI container, an SLPP message, a location services message, an SOR transparent container, a UE policy container or a UE parameters update transparent container;

until the UE receives an allowed NSSAI, a partially allowed NSSAI, or both.

During a registration procedure for mobility and periodic registration update for which the 5GS registration type IE indicates:

a) "mobility registration updating" and the UE is in NB-N1 mode; or

b) "periodic registration updating";

if the REGISTRATION ACCEPT message includes the 5GS registration result IE with the "NSSAA to be performed" indicator not set to "Network slice-specific authentication and authorization is to be performed" and the message does not contain an allowed NSSAI and no new allowed NSSAI, the UE shall consider the previously received allowed NSSAI as valid.

During a registration procedure for mobility and periodic registration update for which the 5GS registration type IE indicates:

a) "mobility registration updating"; or

b) "periodic registration updating";

if the REGISTRATION ACCEPT message includes the 5GS registration result IE with the "NSSAA to be performed" indicator set to "Network slice-specific authentication and authorization is to be performed" and the message contains a pending NSSAI, the UE shall delete any stored allowed NSSAI as specified in subclause 4.6.2.2.

If the Uplink data status IE is included in the REGISTRATION REQUEST message:

a) if the AMF determines that the UE is in non-allowed area or is not in allowed area, and the PDU session(s) indicated by the Uplink data status IE is non-emergency PDU session(s) or the UE is not configured for high priority access in selected PLMN or SNPN, the AMF shall include the PDU session reactivation result IE in the REGISTRATION ACCEPT message indicating that user-plane resources for the corresponding PDU session(s) cannot be re-established, and shall include the PDU session reactivation result error cause IE with the 5GMM cause set to #28 "Restricted service area";

b) otherwise, the AMF shall:

1) indicate the SMF to re-establish the user-plane resources for the corresponding PDU session;

2) include PDU session reactivation result IE in the REGISTRATION ACCEPT message to indicate the user-plane resources re-establishment result of the PDU sessions for which the UE requested to re-establish the user-plane resources; and

3) determine the UE presence in LADN service area (see subclause 6.2.6) and forward the UE presence in LADN service area towards the SMF, if the corresponding PDU session is a PDU session for LADN.

If the Uplink data status IE is not included in the REGISTRATION REQUEST message and the REGISTRATION REQUEST message is sent for the trigger d) in subclause 5.5.1.3.2, the AMF may indicate the SMF to re-establish the user-plane resources for the PDU sessions.

If the registration procedure for mobility registration update is triggered for non-3GPP access path switching from the old non-3GPP access to the new non-3GPP access and there are:

a) one or more single access PDU sessions whose user plane resources are associated to the old non-3GPP access but whose PDU session ID(s) are not indicated in the Uplink data status IE in the REGISTRATION REQUEST message; or

b) one or more MA PDU sessions whose PDU session ID(s) are not indicated in the Uplink data status IE in the REGISTRATION REQUEST message;

the AMF shall not release those PDU session(s) and shall release the user plane resources of the old non-3GPP access of those PDU session(s), so that the UE or the network can re-establish user-plane resources on the new non-3GPP access by triggering a service request procedure.

If a PDU session status IE is included in the REGISTRATION REQUEST message:

a) for single access PDU sessions, the AMF shall:

1) perform a local release of all those PDU sessions which are not in 5GSM state PDU SESSION INACTIVE on the AMF side associated with the access type the REGISTRATION REQUEST message is sent over, but are indicated by the UE as being in 5GSM state PDU SESSION INACTIVE. If any of those PDU sessions is associated with one or more MBS multicast sessions, the SMF shall consider the UE as removed from the associated multicast MBS sessions; and

2) include a PDU session status IE in the REGISTRATION ACCEPT message to indicate which PDU sessions associated with the access type the REGISTRATION ACCEPT message is sent over are not in 5GSM state PDU SESSION INACTIVE in the AMF; and

b) for MA PDU sessions:

1) for all those PDU sessions which are not in 5GSM state PDU SESSION INACTIVE and have user plane resources being established or established on the access the REGISTRATION REQUEST message is sent over on the AMF side, but are indicated by the UE as no user plane resources are being established or established:

i) for PDU sessions having user plane resources being established or established only on the access the REGISTRATION REQUEST message is sent over, the AMF shall perform a local release of all those PDU sessions. If the MA PDU session is associated with one or more multicast MBS sessions, the SMF shall consider the UE as removed from the associated multicast MBS sessions; and

ii) for PDU sessions having user plane resources being established or established on both accesses, the AMF shall perform a local release on the user plane resources associated with the access type the REGISTRATION REQUEST message is sent over. If the REGISTRATION REQUEST message is sent over 3GPP access and the MA PDU session is associated with one or more multicast MBS sessions, the SMF shall consider the UE as removed from the associated multicast MBS sessions; and

2) the AMF shall include a PDU session status IE in the REGISTRATION ACCEPT message to indicate which MA PDU sessions having the corresponding user plane resources are being established or established on the AMF side on the access the REGISTRATION ACCEPT message is sent over.

If the Allowed PDU session status IE is included in the REGISTRATION REQUEST message, the AMF shall:

a) for a 5GSM message from each SMF that has indicated pending downlink signalling only, forward the received 5GSM message via 3GPP access to the UE after the REGISTRATION ACCEPT message is sent;

b) for each SMF that has indicated pending downlink data only:

1) notify the SMF that reactivation of the user-plane resources for the corresponding PDU session(s) associated with non-3GPP access cannot be performed if the corresponding PDU session ID(s) are not indicated in the Allowed PDU session status IE; and

2) notify the SMF that reactivation of the user-plane resources for the corresponding PDU session(s) associated with non-3GPP access can be performed if the corresponding PDU session ID(s) are indicated in the Allowed PDU session status IE.

c) for each SMF that have indicated pending downlink signalling and data:

1) notify the SMF that reactivation of the user-plane resources for the corresponding PDU session(s) associated with non-3GPP access cannot be performed if the corresponding PDU session ID(s) are not indicated in the Allowed PDU session status IE;

2) notify the SMF that reactivation of the user-plane resources for the corresponding PDU session(s) associated with non-3GPP access can be performed if the corresponding PDU session ID(s) are indicated in the Allowed PDU session status IE; and

3) discard the received 5GSM message for PDU session(s) associated with non-3GPP access; and

d) include the PDU session reactivation result IE in the REGISTRATION ACCEPT message to indicate the successfully re-established user-plane resources for the corresponding PDU sessions, if any.

If the PDU session reactivation result IE is included in the REGISTRATION ACCEPT message indicating that the user-plane resources have been successfully reactivated for a PDU session that was indicated by the UE in the Allowed PDU session status IE as allowed to be re-established over 3GPP access, the UE considers the corresponding PDU session to be associated with the 3GPP access. If the user-plane resources of a PDU session have been successfully reactivated over the 3GPP access, the AMF and SMF update the associated access type of the corresponding PDU session.

If the PDU session reactivation result IE is included in the REGISTRATION ACCEPT message indicating that the user-plane resources cannot be established for a PDU session that was indicated by the UE in the Allowed PDU session status IE as allowed to be re-established over 3GPP access, the UE considers the corresponding PDU session to be associated with the non-3GPP access.

If an EPS bearer context status IE is included in the REGISTRATION REQUEST message, the AMF handles the received EPS bearer context status IE as specified in 3GPP TS 23.502 [9].

If the EPS bearer context status information is generated for the UE during the inter-system change from S1 mode to N1 mode as specified in 3GPP TS 23.502 [9] and the AMF supports N26 interface, the AMF shall include an EPS bearer context status IE in the REGISTRATION ACCEPT message to indicate the UE which mapped EPS bearer contexts are active in the network.

If the user-plane resources cannot be established for a PDU session, the AMF shall include the PDU session reactivation result IE in the REGISTRATION ACCEPT message indicating that user-plane resources for the corresponding PDU session cannot be re-established, and:

a) if the user-plane resources cannot be established because the SMF indicated to the AMF that the UE is located out of the LADN service area (see 3GPP TS 29.502 [20A]), the AMF shall include the PDU session reactivation result error cause IE with the 5GMM cause set to #43 "LADN not available";

b) if the user-plane resources cannot be established because the SMF indicated to the AMF that only prioritized services are allowed (see 3GPP TS 29.502 [20A]), the AMF shall include the PDU session reactivation result error cause IE with the 5GMM cause set to #28 "restricted service area";

c) if the user-plane resources cannot be established because the SMF indicated to the AMF that the resource is not available in the UPF (see 3GPP TS 29.502 [20A]), the AMF shall include the PDU session reactivation result error cause IE with the 5GMM cause set to #92 "insufficient user-plane resources for the PDU session";

d) if the user-plane resources cannot be established because the SMF indicated to the AMF that the S-NSSAI associated with the PDU session is unavailable due to NSAC (see 3GPP TS 29.502 [20A]), the AMF shall include the PDU session reactivation result error cause IE with the 5GMM cause set to #69 "insufficient resources for specific slice";

e) if the user-plane resources cannot be established because the AMF determines that the UE is outside the NS-AoS of the S-NSSAI associated with the PDU session, the AMF may include the PDU session reactivation result error cause IE with the 5GMM cause set to #69 "insufficient resources for specific slice" to indicate the cause of failure to re-establish the user-plane resources; or

f) otherwise, the AMF may include the PDU session reactivation result error cause IE to indicate the cause of failure to re-establish the user-plane resources.

NOTE 14: It is up to UE implementation when to re-send a request for user-plane re-establishment for the associated PDU session after receiving a PDU session reactivation result error cause IE with a 5GMM cause set to #92 "insufficient user-plane resources for the PDU session".

NOTE 15: The UE can locally start a back-off timer after receiving a PDU session reactivation result error cause IE with a 5GMM cause set to #69 "insufficient resources for specific slice". The value of the back-off timer is up to UE implementation. Upon expiry of the back-off timer, the UE can re-send a request for user-plane re-establishment for the associated PDU session.

If the AMF needs to initiate PDU session status synchronization the AMF shall include a PDU session status IE in the REGISTRATION ACCEPT message to indicate the UE:

- which single access PDU sessions associated with the access the REGISTRATION ACCEPT message is sent over are not in 5GSM state PDU SESSION INACTIVE in the AMF; and

- which MA PDU sessions are not in 5GSM state PDU SESSION INACTIVE and having user plane resources established in the AMF on the access the REGISTRATION ACCEPT message is sent over.

The AMF may include the LADN information IE in the REGISTRATION ACCEPT message as described in subclause 5.5.1.2.4. The UE, upon receiving the REGISTRATION ACCEPT message with the LADN information IE, shall delete its old LADN information (if any) and store the received new LADN information.

If the UE has set the LADN-DS bit to "LADN per DNN and S-NSSAI supported" in the 5GMM capability IE of the REGISTRATION REQUEST message, the AMF may include the Extended LADN information IE in the Registration accept type 6 IE container IE in the REGISTRATION ACCEPT message as described in subclause 5.5.1.2.4. The UE, upon receiving the REGISTRATION ACCEPT message with the Registration accept type 6 IE container IE which includes the Extended LADN information IE, shall delete its old extended LADN information (if any) and store the received new extended LADN information.

NOTE 15A0: The AMF allocates the LADN service area and the TAI list associated with the S-NSSAI in the partially allowed NSSAI independently, if applicable.

If:

- the UE does not support LADN per DNN and S-NSSAI;

- the UE is subscribed to the LADN DNN for a single S-NSSAI only; and

- the AMF has the extended LADN information but no LADN information;

the AMF may decide to provide the LADN service area for that LADN DNN of the extended LADN information as the LADN information and include the LADN information in the LADN information IE of the REGISTRATION ACCEPT message.

NOTE 15A: If the LADN service area is configured per DNN and S-NSSAI, in order to serve the UEs that do not support LADN per DNN and S-NSSAI, it is recommended that the LADN DNN is only served by a single S-NSSAI.

NOTE 15B: In case of the UE is subscribed to the LADN DNN for multiple S-NSSAIs, the AMF can treat this as no extended LADN information is available.

If the UE does not support LADN per DNN and S-NSSAI and the AMF has neither the LADN information nor the extended LADN information, the AMF shall not provide any LADN information to the UE.

If the AMF does not include:

- the LADN information IE; or

- the Extended LADN information IE in the Registration accept type 6 IE container IE,

in the REGISTRATION ACCEPT message during registration procedure for mobility and periodic registration update, the UE shall delete its old LADN information or old extended LADN information respectively.

If the PDU session status IE is included in the REGISTRATION ACCEPT message:

a) for single access PDU sessions, the UE shall perform a local release of all those PDU sessions associated with the access type the REGISTRATION ACCEPT message is sent over which are not in 5GSM state PDU SESSION INACTIVE or PDU SESSION ACTIVE PENDING on the UE side, but are indicated by the AMF as being in 5GSM state PDU SESSION INACTIVE. If a locally released PDU session is associated with one or more multicast MBS sessions, the UE shall locally leave the associated multicast MBS sessions; and

b) for MA PDU sessions, for all those PDU sessions which are not in 5GSM state PDU SESSION INACTIVE and have the corresponding user plane resources being established or established in the UE on the access the REGISTRATION ACCEPT message is sent over, but are indicated by the AMF as no user plane resources are being established or established:

1) for MA PDU sessions having the corresponding user plane resources being established or established only on the access the REGISTRATION ACCEPT message is sent over, the UE shall perform a local release of those MA PDU sessions. If a locally released MA PDU session is associated with one or more multicast MBS sessions, the UE shall locally leave the associated multicast MBS sessions; and

2) for MA PDU sessions having user plane resources being established or established on both accesses, the UE shall perform a local release on the user plane resources on the access the REGISTRATION ACCEPT message is sent over. If the user plane resources over 3GPP access are released and the MA PDU session is associated with one or more multicast MBS sessions, the UE shall locally leave the associated multicast MBS sessions.

If:

a) the UE included a PDU session status IE in the REGISTRATION REQUEST message;

b) the UE is operating in the single-registration mode;

c) the UE is performing inter-system change from S1 mode to N1 mode in 5GMM-IDLE mode; and

d) the UE has received the IWK N26 bit set to "interworking without N26 interface supported";

the UE shall ignore the PDU session status IE if received in the REGISTRATION ACCEPT message.

If the EPS bearer context status IE is included in the REGISTRATION ACCEPT message, the UE shall locally delete all those QoS flow descriptions and all associated QoS rules, if any, which are associated with inactive EPS bearer contexts as indicated by the AMF in the EPS bearer context status IE.

If the UE included S1 mode supported indication in the REGISTRATION REQUEST message, the AMF supporting interworking with EPS shall set the IWK N26 bit to either:

a) "interworking without N26 interface not supported" if the AMF supports N26 interface; or

b) "interworking without N26 interface supported" if the AMF does not support N26 interface

in the 5GS network feature support IE in the REGISTRATION ACCEPT message.

The UE supporting S1 mode shall operate in the mode for inter-system interworking with EPS as follows:

a) if the IWK N26 bit in the 5GS network feature support IE is set to "interworking without N26 interface not supported", the UE shall operate in single-registration mode;

b) if the IWK N26 bit in the 5GS network feature support IE is set to "interworking without N26 interface supported" and the UE supports dual-registration mode, the UE may operate in dual-registration mode; or

NOTE 16: The registration mode used by the UE is implementation dependent.

c) if the IWK N26 bit in the 5GS network feature support IE is set to "interworking without N26 interface supported" and the UE only supports single-registration mode, the UE shall operate in single-registration mode.

The UE shall store the received interworking without N26 interface indicator for inter-system change with EPS as specified in subclause C.1 and treat it as valid in the entire PLMN and its equivalent PLMN(s).

The network informs the UE about the support of specific features, such as IMS voice over PS session, location services (5G-LCS), emergency services, emergency services fallback, ATSSS and non-3GPP access path switching, in the 5GS network feature support information element. In a UE with IMS voice over PS session capability, the IMS voice over PS session indicator, Emergency services support indicator and Emergency services fallback indicator shall be provided to the upper layers. The upper layers take the IMS voice over PS session indicator into account when selecting the access domain for voice sessions or calls. When initiating an emergency call, the upper layers take the IMS voice over PS session indicator, Emergency services support indicator and Emergency services fallback indicator into account for the access domain selection. When the UE determines via the IMS voice over PS session indicator that the network does not support IMS voice over PS sessions in N1 mode, then the UE shall not perform a local release of any persistent PDU session if the AMF does not indicate that the PDU session is in 5GSM state PDU SESSION INACTIVE via the PDU session status IE. When the UE determines via the Emergency services support indicator that the network does not support emergency services in N1 mode, then the UE shall not perform a local release of any emergency PDU session if user-plane resources associated with that emergency PDU session are established if the AMF does not indicate that the PDU session is in 5GSM state PDU SESSION INACTIVE via the PDU session status IE. In a UE with LCS capability, location services indicators (5G-LCS) shall be provided to the upper layers. In a UE with the capability for ATSSS, the network support for ATSSS shall be provided to the upper layers. If the UE receives the 5GS network feature support IE with the ATSSS support indicator set to "ATSSS not supported", the UE shall perform a local release of the MA PDU session, if any. If a locally released MA PDU session is associated with one or more multicast MBS sessions, the UE shall locally leave the associated multicast MBS sessions. In a UE that supports non-3GPP access path switching, the network support for non-3GPP access path switching shall be provided to the upper layers. If the UE receives the 5GS network feature support IE with the NAPS bit set to "non-3GPP access path switching not supported", the UE shall not perform the registration procedure for mobility registration update for non-3GPP access path switching.

NOTE 16A: If the UE is registered to different PLMNs over 3GPP and non-3GPP accesses, the UE uses the capability received over non-3GPP access to determine whether to initiate the registration procedure for mobility registration update for non-3GPP path switching.

The AMF shall set the EMF bit in the 5GS network feature support IE to:

a) "Emergency services fallback supported in NR connected to 5GCN and E-UTRA connected to 5GCN" if the network supports the emergency services fallback procedure when the UE is in an NR cell connected to 5GCN or an E-UTRA cell connected to 5GCN;

b) "Emergency services fallback supported in NR connected to 5GCN only" if the network supports the emergency services fallback procedure when the UE is in an NR cell connected to 5GCN and does not support the emergency services fallback procedure when the UE is in an E-UTRA cell connected to 5GCN;

c) "Emergency services fallback supported in E-UTRA connected to 5GCN only" if the network supports the emergency services fallback procedure when the UE is in an E-UTRA cell connected to 5GCN and does not support the emergency services fallback procedure when the UE is in an NR cell connected to 5GCN; or

d) "Emergency services fallback not supported" if network does not support the emergency services fallback procedure when the UE is in any cell connected to 5GCN.

NOTE 17: If the emergency services are supported in neither the EPS nor the 5GS homogeneously, based onoperator policy, the AMF will set the EMF bit in the 5GS network feature support IE to "Emergency services fallback not supported".

NOTE 18: Even though the AMF's support of emergency services fallback is indicated per RAT, the UE's support of emergency services fallback is not per RAT, i.e. the UE's support of emergency services fallback is the same for both NR connected to 5GCN and E-UTRA connected to 5GCN.

If the UE indicates support for restriction on use of enhanced coverage in the REGISTRATION REQUEST message and:

a) in WB-N1 mode, the AMF decides to restrict the use of CE mode B for the UE, then the AMF shall set the RestrictEC bit to "CE mode B is restricted";

b) in WB-N1 mode, the AMF decides to restrict the use of both CE mode A and CE mode B for the UE, then the AMF shall set the RestrictEC bit to " Both CE mode A and CE mode B are restricted"; or

c) in NB-N1 mode, the AMF decides to restrict the use of enhanced coverage for the UE, then the AMF shall set the RestrictEC bit to "Use of enhanced coverage is restricted",

in the 5GS network feature support IE in the REGISTRATION ACCEPT message.

Access identity 1 is only applicable while the UE is in N1 mode. Access identity 2 is only applicable while the UE is in N1 mode.

When the UE is registered to the same PLMN or SNPN over 3GPP and non-3GPP access, the UE and the AMF maintain one MPS indicator and one MCS indicator that are common to both 3GPP and non-3GPP access. When the UE is registered to different PLMNs or SNPNs over 3GPP access and non-3GPP access, the UE maintains two MPS indicators and two MCS indicators separately for different accesses i.e., an MPS indicator and an MCS indicator for the 3GPP access and another MPS indicator and an MCS indicator for the non-3GPP access. For both 3GPP and non-3GPP access, the access identity is determined according to subclause 4.5.2:

- if the UE is not operating in SNPN access operation mode:

a) the network informs the UE that the use of access identity 1 is valid in the RPLMN or equivalent PLMN by setting the MPS indicator bit of the 5GS network feature support IE to "Access identity 1 valid", in the REGISTRATION ACCEPT message. Based on operator policy, the AMF sets the MPS indicator bit in the REGISTRATION ACCEPT message based on the MPS priority information in the user's subscription context obtained from the UDM;

b) upon receiving a REGISTRATION ACCEPT message with the MPS indicator bit set to "Access identity 1 valid":

- via 3GPP access; or

- via non-3GPP access if the UE is registered to the same PLMN over 3GPP access and non-3GPP access;

the UE shall act as a UE with access identity 1 configured for MPS, as described in subclause 4.5.2, in all NG-RAN of the registered PLMN and its equivalent PLMNs. The MPS indicator bit in the 5GS network feature support IE provided in the REGISTRATION ACCEPT message is valid in all NG-RAN of the registered PLMN and its equivalent PLMNs until the UE receives a REGISTRATION ACCEPT message or a CONFIGURATION UPDATE COMMAND message with the MPS indicator bit set to "Access identity 1 not valid":

- via 3GPP access; or

- via non-3GPP access if the UE is registered to the same PLMN over 3GPP access and non-3GPP access; or

until the UE selects a non-equivalent PLMN over 3GPP access;

b1) upon receiving a REGISTRATION ACCEPT message with the MPS indicator bit set to "Access identity 1 valid":

- via non-3GPP access; or

- via 3GPP access if the UE is registered to the same PLMN over 3GPP access and non-3GPP access;

the UE shall act as a UE with access identity 1 configured for MPS, as described in subclause 4.5.2, in non-3GPP access of the registered PLMN and its equivalent PLMNs. The MPS indicator bit in the 5GS network feature support IE provided in the REGISTRATION ACCEPT message is valid in non-3GPP access of the registered PLMN and its equivalent PLMNs until the UE receives a REGISTRATION ACCEPT message or a CONFIGURATION UPDATE COMMAND message with the MPS indicator bit set to "Access identity 1 not valid":

- via non-3GPP access; or

- via 3GPP access if the UE is registered to the same PLMN over 3GPP access and non-3GPP access; or

until the UE selects a non-equivalent PLMN over non-3GPP access;

c) during ongoing active PDU sessions that were set up relying on the MPS indicator bit being set to "Access identity 1 valid", if the network indicates in a registration update that the MPS indicator bit is reset to "Access identity 1 not valid", then the UE shall no longer act as a UE with access identity 1 configured for MPS as described in subclause 4.5.2 unless the USIM contains a valid configuration for access identity 1 in RPLMN or equivalent PLMN. In the UE, the ongoing active PDU sessions are not affected by the change of the MPS indicator bit;

d) the network informs the UE that the use of access identity 2 is valid in the RPLMN or equivalent PLMN by setting the MCS indicator bit of the 5GS network feature support IE to "Access identity 2 valid", in the REGISTRATION ACCEPT message. Based on operator policy, the AMF sets the MCS indicator bit in the REGISTRATION ACCEPT message based on the MCS priority information in the user's subscription context obtained from the UDM;

e) upon receiving a REGISTRATION ACCEPT message with the MCS indicator bit set to "Access identity 2 valid":

- via 3GPP access; or

- via non-3GPP access if the UE is registered to the same PLMN over 3GPP access and non-3GPP access;

the UE shall act as a UE with access identity 2 configured for MCS, as described in subclause 4.5.2, in all NG-RAN of the registered PLMN and its equivalent PLMNs. The MCS indicator bit in the 5GS network feature support IE provided in the REGISTRATION ACCEPT message is valid in all NG-RAN of the registered PLMN and its equivalent PLMNs until the UE receives a REGISTRATION ACCEPT message or a CONFIGURATION UPDATE COMMAND message with the MCS indicator bit set to "Access identity 2 not valid":

- via 3GPP access; or

- via non-3GPP access if the UE is registered to the same PLMN over 3GPP access and non-3GPP access; or

until the UE selects a non-equivalent PLMN over 3GPP access;

e1) upon receiving a REGISTRATION ACCEPT message with the MCS indicator bit set to "Access identity 2 valid":

- via non-3GPP access; or

- via 3GPP access if the UE is registered to the same PLMN over 3GPP access and non-3GPP access;

the UE shall act as a UE with access identity 2 configured for MCS, as described in subclause 4.5.2, in non-3GPP access of the registered PLMN and its equivalent PLMNs. The MCS indicator bit in the 5GS network feature support IE provided in the REGISTRATION ACCEPT message is valid in non-3GPP access of the registered PLMN and its equivalent PLMNs until the UE receives a REGISTRATION ACCEPT message or a CONFIGURATION UPDATE COMMAND message with the MCS indicator bit set to "Access identity 2 not valid":

- via non-3GPP access; or

- via 3GPP access if the UE is registered to the same PLMN over 3GPP access and non-3GPP access; or

until the UE selects a non-equivalent PLMN over non-3GPP access; and

f) during ongoing active PDU sessions that were set up relying on the MCS indicator bit being set to "Access identity 2 valid", if the network indicates in a registration update that the MCS indicator bit is reset to "Access identity 2 not valid", then the UE shall no longer act as a UE with access identity 2 configured for MCS as described in subclause 4.5.2 unless the USIM contains a valid configuration for access identity 2 in RPLMN or equivalent PLMN. In the UE, the ongoing active PDU sessions are not affected by the change of the MCS indicator bit; or

- if the UE is operating in SNPN access operation mode:

a) the network informs the UE that the use of access identity 1 is valid in the RSNPN or equivalent SNPN by setting the MPS indicator bit of the 5GS network feature support IE to "Access identity 1 valid", in the REGISTRATION ACCEPT message. Based on operator policy, the AMF sets the MPS indicator bit in the REGISTRATION ACCEPT message based on the MPS priority information in the user's subscription context obtained from the UDM;

b) upon receiving a REGISTRATION ACCEPT message with the MPS indicator bit set to "Access identity 1 valid":

- via 3GPP access; or

- via non-3GPP access if the UE is registered to the same SNPN over 3GPP access and non-3GPP access;

the UE shall act as a UE with access identity 1 configured for MPS, as described in subclause 4.5.2A, in all NG-RAN of the registered SNPN and its equivalent SNPNs. The MPS indicator bit in the 5GS network feature support IE provided in the REGISTRATION ACCEPT message is valid in all NG-RAN of the registered SNPN and its equivalent SNPNs until the UE receives a REGISTRATION ACCEPT message or a CONFIGURATION UPDATE COMMAND message with the MPS indicator bit set to "Access identity 1 not valid":

- via 3GPP access; or

- via non-3GPP access if the UE is registered to the same SNPN over 3GPP access and non-3GPP access; or

until the UE selects a non-equivalent SNPN over 3GPP access;

b1) upon receiving a REGISTRATION ACCEPT message with the MPS indicator bit set to "Access identity 1 valid":

- via non-3GPP access; or

- via 3GPP access if the UE is registered to the same SNPN over 3GPP access and non-3GPP access;

the UE shall act as a UE with access identity 1 configured for MPS, as described in subclause 4.5.2A, in non-3GPP access of the registered SNPN and its equivalent SNPNs. The MPS indicator bit in the 5GS network feature support IE provided in the REGISTRATION ACCEPT message is valid in non-3GPP access of the registered SNPN and its equivalent SNPNs until the UE receives a REGISTRATION ACCEPT message or a CONFIGURATION UPDATE COMMAND message with the MPS indicator bit set to "Access identity 1 not valid":

- via non-3GPP access; or

- via 3GPP access if the UE is registered to the same SNPN over 3GPP access and non-3GPP access; or

until the UE selects a non-equivalent SNPN over non-3GPP access;

c) during ongoing active PDU sessions that were set up relying on the MPS indicator bit being set to "Access identity 1 valid", if the network indicates in a registration update that the MPS indicator bit is reset to "Access identity 1 not valid", then the UE shall no longer act as a UE with access identity 1 configured for MPS as described in subclause 4.5.2A unless the unified access control configuration in the "list of subscriber data" stored in the ME (see 3GPP TS 23.122 [5]) indicates the UE is configured for access identity 1 in the RSNPN or equivalent SNPN. In the UE, the ongoing active PDU sessions are not affected by the change of the MPS indicator bit;

d) the network informs the UE that the use of access identity 2 is valid in the RSNPN or equivalent SNPN by setting the MCS indicator bit of the 5GS network feature support IE to "Access identity 2 valid", in the REGISTRATION ACCEPT message. Based on operator policy, the AMF sets the MCS indicator bit in the REGISTRATION ACCEPT message based on the MCS priority information in the user's subscription context obtained from the UDM;

e) upon receiving a REGISTRATION ACCEPT message with the MCS indicator bit set to "Access identity 2 valid":

- via 3GPP access; or

- via non-3GPP access if the UE is registered to the same SNPN over 3GPP access and non-3GPP access;

the UE shall act as a UE with access identity 2 configured for MCS, as described in subclause 4.5.2A, in all NG-RAN of the registered SNPN and its equivalent SNPNs. The MCS indicator bit in the 5GS network feature support IE provided in the REGISTRATION ACCEPT message is valid in all NG-RAN of the registered SNPN and its equivalent SNPNs until the UE receives a REGISTRATION ACCEPT message or a CONFIGURATION UPDATE COMMAND message with the MCS indicator bit set to "Access identity 2 not valid":

- via 3GPP access; or

- via non-3GPP access if the UE is registered to the same SNPN over 3GPP access and non-3GPP access; or

until the UE selects a non-equivalent SNPN;

e1) upon receiving a REGISTRATION ACCEPT message with the MCS indicator bit set to "Access identity 2 valid":

- via non-3GPP access; or

- via 3GPP access if the UE is registered to the same SNPN over 3GPP access and non-3GPP access;

the UE shall act as a UE with access identity 2 configured for MCS, as described in subclause 4.5.2A, in non-3GPP access of the registered SNPN and its equivalent SNPNs. The MCS indicator bit in the 5GS network feature support IE provided in the REGISTRATION ACCEPT message is valid in non-3GPP access of the registered SNPN and its equivalent SNPNs until the UE receives a REGISTRATION ACCEPT message or a CONFIGURATION UPDATE COMMAND message with the MCS indicator bit set to "Access identity 2 not valid":

- via non-3GPP access; or

- via 3GPP access if the UE is registered to the same SNPN over 3GPP access and non-3GPP access; or

until the UE selects a non-equivalent SNPN over non-3GPP access; and

f) during ongoing active PDU sessions that were set up relying on the MCS indicator bit being set to "Access identity 2 valid", if the network indicates in a registration update that the MCS indicator bit is reset to "Access identity 2 not valid", then the UE shall no longer act as a UE with access identity 2 configured for MCS as described in subclause 4.5.2A unless the unified access control configuration in the "list of subscriber data" stored in the ME (see 3GPP TS 23.122 [5]) indicates the UE is configured for access identity 2 in the RSNPN or equivalent SNPN. In the UE, the ongoing active PDU sessions are not affected by the change of the MCS indicator bit.

If the UE has set the Follow-on request indicator to "Follow-on request pending" in the REGISTRATION REQUEST message, or the network has downlink signalling pending, the AMF shall not immediately release the NAS signalling connection after the completion of the registration procedure.

If the UE is authorized to use V2X communication over PC5 reference point based on:

a) at least one of the following bits in the 5GMM capability IE of the REGISTRATION REQUEST message set by the UE, or already stored in the 5GMM context in the AMF during the previous registration procedure as follows:

1) the V2XCEPC5 bit to "V2X communication over E-UTRA-PC5 supported"; or

2) the V2XCNPC5 bit to "V2X communication over NR-PC5 supported"; and

b) the user's subscription context obtained from the UDM as defined in 3GPP TS 23.287 [6C];

the AMF should not immediately release the NAS signalling connection after the completion of the registration procedure.

If the UE is authorized to use A2X communication over PC5 reference point based on:

a) at least one of the following bits in the 5GMM capability IE of the REGISTRATION REQUEST message set by the UE, or already stored in the 5GMM context in the AMF during the previous registration procedure as follows:

1) the A2XEPC5 bit to "A2X over E-UTRA-PC5 supported"; or

2) the A2XNPC5 bit to "A2X over NR-PC5 supported"; and

b) the user's subscription context obtained from the UDM as defined in 3GPP TS 23.256 [6C];

the AMF should not immediately release the NAS signalling connection after the completion of the registration procedure.

If the UE is authorized to use 5G ProSe services based on:

a) at least one of the following bits in the 5GMM capability IE of the REGISTRATION REQUEST message set by the UE, or already stored in the 5GMM context in the AMF during the previous registration procedure as follows:

1) the 5G ProSe direct discovery bit to "5G ProSe direct discovery supported"; or

2) the 5G ProSe direct communication bit to "5G ProSe direct communication supported"; and

b) the user's subscription context obtained from the UDM as defined in 3GPP TS 23.304 [6E];

the AMF should not immediately release the NAS signalling connection after the completion of the registration procedure.

If the UE indicates support of ranging and sidelink positioning in the REGISTRATION REQUEST message and the network supports and accepts the use of ranging and sidelink positioning, the AMF shall set the ranging and sidelink positioning support bit to "Ranging and sidelink positioning supported" in the 5GS network feature support IE of the REGISTRATION ACCEPT message.

If the UE has included the Non-3GPP path switching information IE in the REGISTRATION REQUEST message with the NSONR bit set to "non-3GPP path switching while using old non-3GPP resources requested" and the AMF supports non-3GPP path switching while using old non-3GPP resources, the AMF shall not release the user plane resources of the old non-3GPP access of the PDU session(s) supporting non-3GPP access path switching and whose PDU session ID(s) are included in the Uplink data status IE of the REGISTRATION REQUEST message until the user plane resources of the new non-3GPP access are established. Otherwise, the AMF shall release the user plane resources of the old non-3GPP access before proceeding with the registration procedure.

If the UE has triggered the registration procedure for mobility registration update for non-3GPP access path switching from the old non-3GPP access to the new non-3GPP access and the UE receives the REGISTRATION ACCEPT message over the new non-3GPP access, the UE shall consider itself as de-registered for 5GS services over the old non-3GPP access.

If the Requested DRX parameters IE was included in the REGISTRATION REQUEST message, the AMF shall include the Negotiated DRX parameters IE in the REGISTRATION ACCEPT message and replace any stored Negotiated DRX parameter and use it for the downlink transfer of signalling and user data. The AMF may set the Negotiated DRX parameters IE based on the received Requested DRX parameters IE and operator policy if available.

If the Requested NB-N1 mode DRX parameters IE was included in the REGISTRATION REQUEST message and replace any stored Negotiated NB-N1 mode DRX parameters and use it for the downlink transfer of signalling and user data in NB-N1 mode, the AMF shall include the Negotiated NB-N1 mode DRX parameters IE in the REGISTRATION ACCEPT message. The AMF may set the Negotiated NB-N1 mode DRX parameters IE based on the received Requested NB-N1 mode DRX parameters IE and operator policy if available.

The AMF shall include the Negotiated extended DRX parameters IE in the REGISTRATION ACCEPT message only if the Requested extended DRX parameters IE was included in the REGISTRATION REQUEST message, and the AMF supports and accepts the use of eDRX. The AMF may set the Negotiated extended DRX parameters IE based on the received Requested extended DRX parameters IE, operator policy, information from NG-RAN and the user's subscription context obtained from the UDM if available.

If the network cannot derive the UE's identity from the 5G-GUTI because of e.g. no matching identity/context in the network, failure to validate the UE's identity due to integrity check failure of the received message, the AMF may operate as described in subclause 5.5.1.2.4 and include a PDU session status IE indicating all PDU sessions are in 5GSM state PDU SESSION INACTIVE in the AMF. If the UE included in the REGISTRATION REQUEST message the UE status IE with the EMM registration status set to "UE is in EMM-REGISTERED state" and the AMF does not support N26 interface, the AMF shall operate as described in subclause 5.5.1.2.4.

If the UE has indicated support for service gap control in the REGISTRATION REQUEST message, a service gap time value is available in the 5GMM context, the AMF may include the T3447 value IE set to the service gap time value in the REGISTRATION ACCEPT message.

If the UE requests ciphering keys for ciphered broadcast assistance data in the REGISTRATION REQUEST message and the AMF has valid ciphering key data applicable to the UE's subscription and current tracking area, then the AMF shall include the ciphering key data in the Ciphering key data IE of the REGISTRATION ACCEPT message.

If the UE supports WUS assistance information and the AMF supports and accepts the use of WUS assistance information for the UE, then the AMF shall determine the negotiated UE paging probability information for the UE, store it in the 5GMM context of the UE, and if the UE does not have an active emergency PDU session, the AMF shall include it in the Negotiated WUS assistance information IE in the REGISTRATION ACCEPT message. The AMF may consider the UE paging probability information received in the Requested WUS assistance information IE when determining the negotiated UE paging probability information for the UE.

NOTE 19: Besides the UE paging probability information requested by the UE, the AMF can take local configuration or previous statistical information for the UE into account when determining the negotiated UE paging probability information for the UE.

If the UE sets the NR-PSSI bit to "NR paging subgrouping supported" in the 5GMM capability IE in the REGISTRATION REQUEST message and the AMF supports and accepts the use of PEIPS assistance information for the UE, then the AMF shall determine the Paging subgroup ID for the UE, store it in the 5GMM context of the UE, and include it in the Negotiated PEIPS assistance information IE in the REGISTRATION ACCEPT message or in the Updated PEIPS assistance information IE in the CONFIGURATION UPDATE COMMAND message as part of the registration procedure. The AMF may consider the UE paging probability information received in the Requested PEIPS assistance information IE when determining the Paging subgroup ID for the UE.

NOTE 20: Besides the UE paging probability information when provided by the UE, the AMF can also take local configuration, whether the UE is likely to receive IMS voice over PS session calls, UE mobility pattern or previous statistical information for the UE or information provided by the NG-RAN into account when determining the Paging subgroup ID for the UE.

If the UE sets the UN-PER bit to "unavailability period supported" in the 5GMM capability IE in the REGISTRATION REQUEST message and the AMF supports and accepts the use of unavailability period for the UE, then the AMF shall set the UN-PER bit to "unavailability period supported" in the 5GS network feature support IE in the REGISTRATION ACCEPT message.

If the UE sets the Unavailability type to "unavailability due to UE reasons" in the Unavailability information IE in the REGISTRATION REQUEST message, then the AMF shall:

a) set the Unavailability period duration and the Start of the unavailability period to the value provided by the UE and the AMF shall store the Start of unavailability period value and the Unavailability period duration. When the time of the Start of unavailability period arrives, the AMF shall consider the UE as unreachable until the UE registers for normal service;

b) store the received unavailability period duration, if any and the received start of unavailability period, if any;

c) determine whether the UE is required to perform the registration procedure for mobility registration update when the unavailability period has ended and set the EUPR bit to "UE needs to report end of unavailability period" or "UE does not need to report end of unavailability period" in the Unavailability configuration IE in the REGISTRATION ACCEPT message; and

d) release the signalling connection immediately after the completion of the registration procedure.

If the UE sets the Unavailability type to "unavailability due to discontinuous coverage" in the Unavailability information IE and the UE provides the Unavailability information IE in the REGISTRATION REQUEST message then:

a) if the AMF is able to determine an unavailability period duration for the UE based on satellite coverage availability information (see 3GPP TS 23.401 [7]) and the value of the Unavailability information IE in the REGISTRATION REQUEST message if available, then the AMF shall store the determined unavailability period duration and provide the expected unavailability period duration to the UE by including the Unavailability period duration in the Unavailability configuration IE in the REGISTRATION ACCEPT message. If the AMF is able to determine the start of the unavailability period based on satellite coverage availability information and the value of the Unavailability information IE in the REGISTRATION REQUEST message if available, then the AMF shall store the determined start of the unavailability period and provide the expected start of the unavailability period to the UE by including the start of the unavailability period in the Unavailability configuration IE in the REGISTRATION ACCEPT message;

b1) the AMF shall determine the unavailability period duration value as:

1) a value that was provided by the UE; or

2) a value that was determined by the AMF based on satellite coverage availability information;

b2) the AMF shall determine the start of the unavailability period value as:

1) a value that was provided by the UE; or

2) a value that was determined by the AMF based on satellite coverage availability information; and

the AMF shall store the unavailability period duration and the start of unavailability period value. When the unavailability period starts, the AMF shall consider the UE as unreachable until the UE registers for normal service again; and

c) the AMF shall determine whether the UE is required to perform the registration procedure for mobility registration update in NG-RAN satellite access when the unavailability period has ended and set the EUPR bit to "UE needs to report end of unavailability period" or "UE does not need to report end of unavailability period" in the Unavailability configuration IE in the REGISTRATION ACCEPT message.

The AMF may determine the periodic registration update timer value based on the stored value of the received unavailability period duration if any, the received Start of unavailability period if any, the network determined unavailability period duration if any and the network determined Start of unavailability period if any. If the UE does not provide the Unavailability information IE in the REGISTRATION REQUEST message, the AMF shall delete any stored value of the Unavailability information IE if exists.

If the 5GS registration type IE in the REGISTRATION REQUEST message indicates "periodic registration updating" the AMF shall not incude the Unavailability configuration IE in the REGISTRATION ACCEPT message.

If the UE receives the Unavailability configuration IE with a value of the unavailability period duration in the REGISTRATION ACCEPT message, then the UE may either:

a) delete a UE determined value and start using the received value; or

b) use a UE determined value.

If the UE receives the Unavailability configuration IE with a value of the start of the unavailability period in the REGISTRATION ACCEPT message, then the UE may either:

a) delete a UE determined value and start using the received value; or

b) use a UE determined value.

NOTE 20a: The UE can consider the received value from the network when determining the value for unavailability period duration and the start of the unavailability period.

If the UE has stored a value of the unavailability period duration and receives the Unavailability configuration IE without a value of the unavailability period duration in the REGISTRATION ACCEPT message, then the UE may use a UE determined value.

If the UE has stored a value of the start of the unavailability period and receives the Unavailability configuration IE without a value of the start of the unavailability period in the REGISTRATION ACCEPT message, then the UE may use a UE determined value.

If due to regional subscription restrictions or access restrictions the UE is not allowed to access the TA or due to CAG restrictions the UE is not allowed to access the cell, but the UE has an emergency PDU session established, the AMF may accept the REGISTRATION REQUEST message and indicate to the SMF to perform a local release of all non-emergency PDU sessions (associated with 3GPP access if it is due to CAG restrictions) and informs the UE via the PDU session status IE in the REGISTRATION ACCEPT message. The AMF shall not indicate to the SMF to release the emergency PDU session. If the AMF indicated to the SMF to perform a local release of all non-emergency PDU sessions (associated with 3GPP access if it is due to CAG restrictions), the network shall behave as if the UE is registered for emergency services and shall set the emergency registered bit of the 5GS registration result IE to "Registered for emergency services" in the REGISTRATION ACCEPT message.

If the REGISTRATION ACCEPT message includes the PDU session reactivation result error cause IE with the 5GMM cause set to #28 "Restricted service area", the UE shall enter the state 5GMM-REGISTERED.NON-ALLOWED-SERVICE and behave as specified in subclause 5.3.5.

If the REGISTRATION ACCEPT message includes the SOR transparent container IE and:

a) the SOR transparent container IE does not successfully pass the integrity check (see 3GPP TS 33.501 [24]); and

b) if the UE attempts obtaining service on another PLMNs or SNPNs as specified in 3GPP TS 23.122 [5] annex C;

then the UE shall release locally the established NAS signalling connection after sending a REGISTRATION COMPLETE message.

If the REGISTRATION ACCEPT message includes the SOR transparent container IE and the SOR transparent container IE successfully passes the integrity check (see 3GPP TS 33.501 [24]), the ME shall store the received SOR counter as specified in annex C and proceed as follows:

a) the UE shall proceed with the behaviour as specified in 3GPP TS 23.122 [5] annex C; and

b) if the registration procedure is performed over 3GPP access and the UE attempts obtaining service on another PLMNs or SNPNs as specified in 3GPP TS 23.122 [5] annex C then the UE may release locally the established NAS signalling connection after sending a REGISTRATION COMPLETE message. Otherwise the UE shall send a REGISTRATION COMPLETE message and not release the current N1 NAS signalling connection locally. If an acknowledgement is requested in the SOR transparent container IE of the REGISTRATION ACCEPT message, the UE acknowledgement is included in the SOR transparent container IE of the REGISTRATION COMPLETE message. In the SOR transparent container IE carrying the acknowledgement, the UE shall set the ME support of SOR-CMCI indicator to "SOR-CMCI supported by the ME". Additionally, if the UE supports access to an SNPN using credentials from a credentials holder and the UE is not operating in SNPN access operation mode, the UE may set the ME support of SOR-SNPN-SI indicator to "SOR-SNPN-SI supported by the ME". Additionally, if the UE supports access to an SNPN providing access for localized services in SNPN, the UE shall set the ME support of SOR-SNPN-SI-LS indicator to "SOR-SNPN-SI-LS supported by the ME".

If the SOR transparent container IE successfully passes the integrity check (see 3GPP TS 33.501 [24]), and:

a) the SOR transparent container IE indicates a list of preferred PLMN/access technology combinations is provided and the list type indicates "PLMN ID and access technology list", then the ME shall replace the highest priority entries in the "Operator Controlled PLMN Selector with Access Technology" list stored in the ME and shall proceed with the behaviour as specified in 3GPP TS 23.122 [5] annex C.

If the SOR-CMCI is present and the Store SOR-CMCI in ME indicator is set to "Store SOR-CMCI in ME" then the UE shall store or delete the SOR-CMCI in the non-volatile memory of the ME as described in annex C.1;

b) the list type indicates "secured packet", then the ME shall behave as if a SMS is received with protocol identifier set to SIM data download, data coding scheme set to class 2 message and SMS payload as secured packet contents of SOR transparent container IE. The SMS payload is forwarded to UICC as specified in 3GPP TS 23.040 [4A]; or

c) the SOR transparent container IE indicates "HPLMN indication that 'no change of the "Operator Controlled PLMN Selector with Access Technology" list stored in the UE is needed and thus no list of preferred PLMN/access technology combinations is provided'", the UE operates in SNPN access operation mode and the SOR transparent container IE includes SOR-SNPN-SI, the ME shall replace SOR-SNPN-SI of the selected entry of the "list of subscriber data" or associated with the selected PLMN subscription, as specified in 3GPP TS 23.122 [5] with the received SOR-SNPN-SI. Additionally, if the SOR transparent container IE includes SOR-SNPN-SI-LS, the ME shall replace SOR-SNPN-SI-LS of the selected entry of the "list of subscriber data" or associated with the selected PLMN subscription, as specified in 3GPP TS 23.122 [5] with the received SOR-SNPN-SI-LS.

If the SOR-CMCI is present and the Store SOR-CMCI in ME indicator is set to "Store SOR-CMCI in ME" then the UE shall store or delete the SOR-CMCI in the non-volatile memory of the ME as described in sbuclause C.1;

and the UE shall proceed with the behaviour as specified in 3GPP TS 23.122 [5] annex C.

If the SOR transparent container IE does not pass the integrity check successfully, then the UE shall discard the content of the SOR transparent container IE.

If required by operator policy, the AMF shall include the NSSAI inclusion mode IE in the REGISTRATION ACCEPT message (see table 4.6.2.3.1 of subclause 4.6.2.3). Upon receipt of the REGISTRATION ACCEPT message:

a) if the message includes the NSSAI inclusion mode IE, the UE shall operate in the NSSAI inclusion mode indicated in the NSSAI inclusion mode IE over the current access within the current PLMN and its equivalent PLMN(s), if any, or the current SNPN, in the current registration area; or

b) otherwise:

1) if the UE has NSSAI inclusion mode for the current PLMN or SNPN and access type stored in the UE, the UE shall operate in the stored NSSAI inclusion mode;

2) if the UE does not have NSSAI inclusion mode for the current PLMN or SNPN and the access type stored in the UE and if the UE is performing the registration procedure over:

i) 3GPP access, the UE shall operate in NSSAI inclusion mode D in the current PLMN or SNPN and the current access type;

ii) untrusted non-3GPP access, the UE shall operate in NSSAI inclusion mode C in the current PLMN and the current access type; or

iii) trusted non-3GPP access, the UE shall operate in NSSAI inclusion mode D in the current PLMN and the current access type; or

3) if the 5G-RG does not have NSSAI inclusion mode for the current PLMN and wireline access stored in the 5G-RG, and the 5G-RG is performing the registration procedure over wireline access, the 5G-RG shall operate in NSSAI inclusion mode B in the current PLMN and the current access type.

The AMF may include operator-defined access category definitions in the REGISTRATION ACCEPT message.

If there is a running T3447 timer in the AMF and the Uplink data status IE is included or the Follow-on request indicator is set to "Follow-on request pending" in the REGISTRATION REQUEST message, the AMF shall ignore the Uplink data status IE or that the Follow-on request indicator is set to "Follow-on request pending" and proceed as if the Uplink data status IE was not received or the Follow-on request indicator was not set to "Follow-on request pending" except for the following case:

- the PDU session indicated by the Uplink data status IE is emergency PDU session;

- the UE is configured for high priority access in selected PLMN;

- the REGISTRATION REQUEST message is as a paging response; or

- the UE is establishing an emergency PDU session or performing emergency services fallback.

If the UE receives Operator-defined access category definitions IE in the REGISTRATION ACCEPT message and the Operator-defined access category definitions IE contains one or more operator-defined access category definitions, the UE shall delete any operator-defined access category definitions stored for the RPLMN and shall store the received operator-defined access category definitions for the RPLMN. If the UE receives the Operator-defined access category definitions IE in the REGISTRATION ACCEPT message and the Operator-defined access category definitions IE contains no operator-defined access category definitions, the UE shall delete any operator-defined access category definitions stored for the RPLMN. If the REGISTRATION ACCEPT message does not contain the Operator-defined access category definitions IE, the UE shall not delete the operator-defined access category definitions stored for the RPLMN.

If the UE has indicated support for service gap control in the REGISTRATION REQUEST message and:

- the REGISTRATION ACCEPT message contains the T3447 value IE, then the UE shall store the new T3447 value, erase any previous stored T3447 value if exists and use the new T3447 value with the timer T3447 next time it is started; or

- the REGISTRATION ACCEPT message does not contain the T3447 value IE, then the UE shall erase any previous stored T3447 value if exists and stop the timer T3447 if running.

If the REGISTRATION ACCEPT message contains the Truncated 5G-S-TMSI configuration IE, then the UE shall store the included truncated 5G-S-TMSI configuration and return a REGISTRATION COMPLETE message to the AMF to acknowledge reception of the truncated 5G-S-TMSI configuration.

NOTE 21: The UE provides the truncated 5G-S-TMSI configuration to the lower layers.

If the UE is not in NB-N1 mode, the UE has set the RACS bit to "RACS supported" in the 5GMM Capability IE of the REGISTRATION REQUEST message, and the REGISTRATION ACCEPT message includes:

a) a UE radio capability ID deletion indication IE set to "Network-assigned UE radio capability IDs deletion requested", the UE shall delete any network-assigned UE radio capability IDs associated with the RPLMN or RSNPN and, if the UE supports access to an SNPN using credentials from a credentials holder, equivalent SNPNs or both, the selected entry of the "list of subscriber data" or the selected PLMN subscription stored at the UE, then the UE shall initiate a registration procedure for mobility and periodic registration update as specified in subclause 5.5.1.3.2 over the existing N1 NAS signalling connection; or

b) a UE radio capability ID IE, the UE shall store the UE radio capability ID as specified in annex C.

If the registration procedure for mobility and periodic registration update was initiated and there is a request from the upper layers to perform "emergency services fallback" pending, the UE shall restart the service request procedure after the successful completion of the mobility and periodic registration update.

When AMF re-allocation occurs in the registration procedure for mobility and periodic registration update, if the new AMF receives in the 5GMM context of the UE the indication that the UE is registered for onboarding services in SNPN, the new AMF may start an implementation specific timer for onboarding services when the registration procedure for mobility and periodic registration update is successfully completed.

If the UE has included the service-level device ID set to the CAA-level UAV ID in the Service-level-AA container IE of the REGISTRATION REQUEST message and the REGISTRATION ACCEPT message contains the service-level-AA pending indication in the Service-level-AA container IE, the UE shall return a REGISTRATION COMPLETE message to the AMF to acknowledge reception of the service-level-AA pending indication, and the UE shall not attempt to perform another registration procedure for UAS services until the UUAA-MM procedure is completed, or to establish a PDU session for USS communication or a PDU session for C2 communication until the UUAA-MM procedure is completed successfully.

If the UE has included the service-level device ID set to the CAA-level UAV ID in the Service-level-AA container IE of the REGISTRATION REQUEST message and the REGISTRATION ACCEPT message does not contain the service-level-AA pending indication in the Service-level-AA container IE, the UE shall consider the UUAA-MM procedure is not triggered.

If the UE is registered for onboarding services in SNPN or the network determines that the UE's subscription only allows for configuration of SNPN subscription parameters in PLMN via the user plane, the AMF may start an implementation specific timer for onboarding services, if not running already, when the network considers that the UE is in 5GMM-REGISTERED (i.e. the network receives the REGISTRATION COMPLETE message from UE).

NOTE 22: If the AMF considers that the UE is in 5GMM-IDLE, when the implementation specific timer for onboarding services expires and the network considers that the UE is still in state 5GMM-REGISTERED, the AMF can locally de-register the UE; or if the UE is in 5GMM-CONNECTED, the AMF can initiate the network-initiated de-registration procedure (see subclause 5.5.2.3).

NOTE 23: The value of the implementation specific timer for onboarding services needs to be large enough to allow a UE to complete the configuration of one or more entries of the "list of subscriber data" taking into consideration that configuration of SNPN subscription parameters in PLMN via the user plane or onboarding services in SNPN involves third party entities outside of the operator's network.

If the UE receives the List of PLMNs to be used in disaster condition IE in the REGISTRATION ACCEPT message and the UE supports MINT, the UE shall delete the "list of PLMN(s) to be used in disaster condition" stored in the ME together with the PLMN ID of the RPLMN, if any, and may store the "list of PLMN(s) to be used in disaster condition" included in the List of PLMNs to be used in disaster condition IE in the ME together with the PLMN ID of the RPLMN.

If the UE receives the Disaster roaming wait range IE in the REGISTRATION ACCEPT message and the UE supports MINT, the UE shall delete the disaster roaming wait range stored in the ME, if any, and store the disaster roaming wait range included in the Disaster roaming wait range IE in the ME.

If the UE receives the Disaster return wait range IE in the REGISTRATION ACCEPT message and the UE supports MINT, the UE shall delete the disaster return wait range stored in the ME, if any, and store the disaster return wait range stored included in the Disaster return wait range IE in the ME.

If the 5GS registration type IE is set to "disaster roaming mobility registration updating" and:

a) the UE determined PLMN with disaster condition IE is included in the REGISTRATION REQUEST message, the AMF shall determine the PLMN with disaster condition in the UE determined PLMN with disaster condition IE;

b) the UE determined PLMN with disaster condition IE is not included in the REGISTRATION REQUEST message and the Additional GUTI IE is included in the REGISTRATION REQUEST message and contains 5G-GUTI of a PLMN of the country of the PLMN providing disaster roaming, the AMF shall determine the PLMN with disaster condition in the PLMN identity of the 5G-GUTI;

c) the UE determined PLMN with disaster condition IE and the Additional GUTI IE are not included in the REGISTRATION REQUEST message and:

1) the 5GS mobile identity IE contains 5G-GUTI of a PLMN of the country of the PLMN providing disaster roaming, the AMF shall determine the PLMN with disaster condition in the PLMN identity of the 5G-GUTI; or

2) the 5GS mobile identity IE contains SUCI of a PLMN of the country of the PLMN providing disaster roaming, the AMF shall determine the PLMN with disaster condition in the PLMN identity of the SUCI; or

d) the UE determined PLMN with disaster condition IE is not included in the REGISTRATION REQUEST message, NG-RAN of the PLMN providing disaster roaming broadcasts disaster roaming indication and:

- the Additional GUTI IE is included in the REGISTRATION REQUEST message and contains 5G-GUTI of a PLMN of a country other than the country of the PLMN providing disaster roaming; or

- the Additional GUTI IE is not included and the 5GS mobile identity IE contains 5G-GUTI or SUCI of a PLMN of a country other than the country of the PLMN providing disaster roaming;

the AMF shall determine the PLMN with disaster condition based on the disaster roaming agreement arrangement between mobile network operators.

NOTE 24: The disaster roaming agreement arrangement between mobile network operators is out scope of 3GPP.

If the AMF determines that a disaster condition applies to the PLMN with disaster condition, and the UE is allowed to be registered for disaster roaming services, the AMF shall set the Disaster roaming registration result value bit in the 5GS registration result IE to "no additional information" in the REGISTRATION ACCEPT message. If the AMF determines that the UE can be registered to the PLMN for normal service, the AMF shall set the Disaster roaming registration result value bit in the 5GS registration result IE to "request for registration for disaster roaming service accepted as registration not for disaster roaming service" in the REGISTRATION ACCEPT message.

If the UE indicates "disaster roaming mobility registration updating" in the 5GS registration type IE in the REGISTRATION REQUEST message and the 5GS registration result IE value in the REGISTRATION ACCEPT message is set to:

- "request for registration for disaster roaming service accepted as registration not for disaster roaming service", the UE shall consider itself registered for normal service. If the PLMN identity of the registered PLMN is a member of the forbidden PLMN list as specified in subclause 5.3.13A, any such PLMN identity shall be deleted from the corresponding list(s). If UE supports S1 mode, the UE shall initiate the registration procedure for mobility and periodic registration update and indicate that S1 mode is supported as described in subclause 5.5.1.3.2; or

- "no additional information", the UE shall consider itself registered for disaster roaming.

If the UE receives the Forbidden TAI(s) for the list of "5GS forbidden tracking areas for roaming" IE in the REGISTRATION ACCEPT message and the TAI(s) included in the IE is not part of the list of "5GS forbidden tracking areas for roaming", the UE shall store the TAI(s) belonging to the serving PLMN or equivalent PLMN(s) and ignore the TAI(s) which do not belong to the serving PLMN or equivalent PLMN(s) included in the IE into the list of "5GS forbidden tracking areas for roaming" and remove the TAI(s) from the stored TAI list if present.

If the UE receives the Forbidden TAI(s) for the list of "5GS forbidden tracking areas for regional provision of service" IE in the REGISTRATION ACCEPT message and the TAI(s) included in the IE is not part of the list of "5GS forbidden tracking areas for regional provision of service", the UE shall store the TAI(s) belonging to the serving PLMN or equivalent PLMN(s) and ignore the TAI(s) which do not belong to the serving PLMN or equivalent PLMN(s) included in the IE into the list of "5GS forbidden tracking areas for regional provision of service" and remove the TAI(s) from the stored TAI list if present.

If the ESI bit of the 5GMM capability IE of the REGISTRATION REQUEST message is set to "equivalent SNPNs supported", and the serving SNPN changes, the AMF shall indicate the NID of the serving SNPN in the REGISTRATION ACCEPT message. The UE shall determine the SNPN identity of the RSNPN from the NID received in the REGISTRATION ACCEPT message and the MCC and the MNC of the new 5G-GUTI.

If the UE supporting the reconnection to the network due to RAN timing synchronization status change receives the RAN timing synchronization IE with the RecReq bit set to "Reconnection requested" in the REGISTRATION ACCEPT message, the UE shall operate as specified in subclauses 5.3.1.4, 5.5.1.3.2 and 5.6.1.1.

If the UE supports discontinuous coverage, the AMF may include the Discontinuous coverage maximum time offset IE in the REGISTRATION ACCEPT message.

If the UE receives, the Discontinuous coverage maximum time offset IE in the REGISTRATION ACCEPT message, the UE shall replace any previously received maximum time offset value on the same satellite NG-RAN RAT type and PLMN with the latest received timer value.

If the AMF includes Unavailability configuration IE in the REGISTRATION ACCEPT message and sets the EUPR bit to "UE does not need to report end of unavailability period", the UE is not required to initiate the registration procedure for mobility registration update when the unavailability period duration has ended. If the UE does not receive the Unavailability configuration IE or the EUPR bit is set to "UE needs to report end of unavailability period", the UE shall trigger registration procedure for mobility registration update as specified in subclause 5.3.26.

If the UE operating as MBSR receives the MBSRAI field of the Feature authorization indication IE in the REGISTRATION ACCEPT message, the UE NAS layer informs the lower layers of the status of MBSR authorization as specified in subclause 5.35A.4 of 3GPP TS 23.501 [8].

If the UE indicates support of the RAT utilization control in the REGISTRATION REQUEST message over 3GPP access and the network decides to apply the RAT utilization control, the AMF shall include the RAT utilization control IE in the REGISTRATION ACCEPT message. In the RAT utilization control IE, the AMF shall not indicate that the access technology of the NG-RAN cell on which the REGISTRATION REQUEST message was received is restricted. If the REGISTRATION ACCEPT message received over 3GPP access contains the RAT utilization control IE, the UE shall store the received RAT utilization control information together with the PLMN identity of the current PLMN in the list of "PLMNs with associated RAT restrictions" and replace the previously stored one associated with the current PLMN, if any, with the newly received RAT utilization control information. Otherwise, if the UE indicated support of the RAT utilization control in the REGISTRATION REQUEST message and the REGISTRATION ACCEPT message does not contain the RAT utilization control IE, the UE shall delete the stored RAT utilization control information associated with the current PLMN if any.

##### 5.5.1.3.5 Mobility and periodic registration update not accepted by the network

If the mobility and periodic registration update request cannot be accepted by the network, the AMF shall send a REGISTRATION REJECT message to the UE including an appropriate 5GMM cause value.

If the mobility and periodic registration update request is rejected due to general NAS level mobility management congestion control, the network shall set the 5GMM cause value to #22 "congestion" and assign a value for back-off timer T3346.

If the mobility and periodic registration update request is rejected due to general NAS level mobility management congestion control for an SNPN providing access localized services in SNPN the network may set an appropriate cause value other than 5GMM cause value to #22 "congestion" and does not assign a value for back-off timer T3346.

In NB-N1 mode, if the mobility and periodic registration update request is rejected due to operator determined barring (see 3GPP TS 29.503 [20AB]), the network shall set the 5GMM cause value to #22 "congestion" and assign a value for back-off timer T3346.

When the UE performs inter-system change from S1 mode to N1 mode, if the AMF is informed that verification of the integrity protection of the TRACKING AREA UPDATE REQUEST message included by the UE in the EPS NAS message container IE of the REGISTRATION REQUEST message has failed in the MME, then:

a) If the AMF can retrieve the current 5G NAS security context as indicated by the ngKSI and 5G-GUTI sent by the UE, the AMF shall proceed as specified in subclause 5.5.1.3.4;

b) if the AMF cannot retrieve the current 5G NAS security context as indicated by the ngKSI and 5G-GUTI sent by the UE, or the ngKSI or 5G-GUTI was not sent by the UE, the AMF may initiate the identification procedure by sending the IDENTITY REQUEST message with the "Type of identity" of the 5GS identity type IE set to "SUCI" before taking actions as specified in subclause 4.4.4.3; or

c) If the AMF needs to reject the mobility and periodic registration update procedure, the AMF shall send REGISTRATION REJECT message including 5GMM cause #9 "UE identity cannot be derived by the network".

If the REGISTRATION REJECT message with 5GMM cause #76 or #78 was received without integrity protection, then the UE shall discard the message. If the REGISTRATION REJECT message with 5GMM cause #62 was received without integrity protected, the behaviour of the UE is specified in subclause 5.3.20.2.

Based on operator policy, if the mobility and periodic registration update request is rejected due to core network redirection for CIoT optimizations, the network shall set the 5GMM cause value to #31 "Redirection to EPC required".

NOTE 1: The network can take into account the UE's S1 mode capability, the EPS CIoT network behaviour supported by the UE or the EPS CIoT network behaviour supported by the EPC to determine the rejection with the 5GMM cause value #31 "Redirection to EPC required".

If the mobility and periodic registration update request is rejected because:

a) all the S-NSSAI(s) included in the requested NSSAI (i.e. Requested NSSAI IE or Requested mapped NSSAI IE) are rejected;

b) the UE set the NSSAA bit in the 5GMM capability IE to:

1) "Network slice-specific authentication and authorization supported" and;

i) void;

ii) all default S-NSSAIs are not allowed; or

iii) network slice-specific authentication and authorization has failed or been revoked for all default S-NSSAIs and based on network local policy, the network decides not to initiate the network slice-specific re-authentication and re-authorization procedures for any default S-NSSAI requested by the UE; or

2) "Network slice-specific authentication and authorization not supported" and all subscribed default S-NSSAIs marked as default are either not allowed or are subject to network slice-specific authentication and authorization; and

i) void; or

ii) void; and

c) no emergency PDU session has been established for the UE;

the network shall set the 5GMM cause value of the REGISTRATION REJECT message to #62 "No network slices available" and shall include, in the rejected NSSAI of the REGISTRATION REJECT message, all the S-NSSAI(s) which were included in the requested NSSAI.

If the UE has set the ER-NSSAI bit to "Extended rejected NSSAI supported" in the 5GMM capability IE of the REGISTRATION REQUEST message, the rejected S-NSSAI(s) shall be included in the Extended rejected NSSAI IE of the REGISTRATION REJECT message. Otherwise, the rejected S-NSSAI(s) shall be included in the Rejected NSSAI IE of the REGISTRATION REJECT message.

In roaming scenarios, if the Extended rejected NSSAI IE is included in the REGISTRATION REJECT message, the AMF shall provide mapped S-NSSAI(s) for the rejected NSSAI.

If the UE supports extended rejected NSSAI and the AMF determines that maximum number of UEs reached for one or more S-NSSAI(s) in the requested NSSAI as specified in subclause 4.6.2.5, the AMF shall include the rejected NSSAI containing one or more S-NSSAIs with the rejection cause "S-NSSAI not available due to maximum number of UEs reached" in the Extended rejected NSSAI IE in the REGISTRATION REJECT message. In addition, the AMF may include a back-off timer value for each S-NSSAI with the rejection cause "S-NSSAI not available due to maximum number of UEs reached" in the Extended rejected NSSAI IE of the REGISTRATION REJECT message.

If the mobility and periodic registration update request from a UE supporting CAG is rejected due to CAG restrictions, the network shall set the 5GMM cause value to #76 "Not authorized for this CAG or authorized for CAG cells only" and should include the "CAG information list" in the CAG information list IE or the Extended CAG information list IE in the REGISTRATION REJECT message.

NOTE 2: The network cannot be certain that "CAG information list" stored in the UE is updated as result of sending of the REGISTRATION REJECT message with the CAG information list IE or the Extended CAG information list IE, as the REGISTRATION REJECT message is not necessarily delivered to the UE (e.g due to abnormal radio conditions).

NOTE 3: The "CAG information list" can be provided by the AMF and include no entry if no "CAG information list" exists in the subscription.

NOTE 3A: If the UE supports extended CAG information list, the CAG information list can be included either in the CAG information list IE or Extended CAG information list IE.

NOTE 3B: It is unexpected for network to send REGISTRATION REJECT message to the UE with 5GMM cause value #76 in non-CAG cell and not indicate "Indication that the UE is only allowed to access 5GS via CAG cells" for the serving PLMN in the Extended CAG information list or the CAG information list.

If the UE does not support extended CAG information list, the CAG information list shall not be included in the Extended CAG information list IE.

If the mobility and periodic registration update request from a UE not supporting CAG is rejected due to CAG restrictions, the network shall operate as described in bullet i) of subclause 5.5.1.3.8.

If the UE's mobility and periodic registration update request is via a satellite NG-RAN cell and the network determines that the UE is in a location where the network is not allowed to operate, see 3GPP TS 23.502 [9], the network shall set the 5GMM cause value in the REGISTRATION REJECT message to #78 "PLMN not allowed at the present UE location".

NOTE 4: When the UE is accessing network for emergency services, it is up to operator and regulatory policies whether the network needs to determine if the UE is in a location where network is not allowed to operate.

NOTE 4A: While location determination is ongoing to ensure that operator and regulatory policies are met, the AMF can perform DNN-based or S-NSSAI based congestion control as specified in subclauses 5.3.10 and 5.3.11 to prevent the UE from accessing network.

If the AMF receives the mobility and periodic registration update request including the service-level device ID set to the CAA-level UAV ID in the Service-level-AA container IE and the AMF determines that the UE is not allowed to use UAS services via 5GS based on the user's subscription data and the operator policy, the AMF shall return a REGISTRATION REJECT message with 5GMM cause #79 “UAS services not allowed”.

If the mobility and periodic registration update request from a UE supporting MINT is rejected due to a disaster condition no longer being applicable in the current location of the UE, the network shall set the 5GMM cause value to #11 "PLMN not allowed" or #13 "Roaming not allowed in this tracking area" and may include a disaster return wait range in the Disaster return wait range IE in the REGISTRATION REJECT message.

If the UE initiates the registration procedure for disaster roaming and the AMF determines that it does not support providing disaster roaming services for the determined PLMN with disaster condition to the UE, then the AMF shall send a REGISTRATION REJECT message with 5GMM cause #80 “Disaster roaming for the determined PLMN with disaster condition not allowed”.

If the AMF receives the mobility and periodic registration update request over non-3GPP access and detects that the N3IWF used by the UE is not compatible with the allowed NSSAI and the UE has indicated its support for slice-based N3IWF selection in the REGISTRATION REQUEST message, the AMF may send a REGISTRATION REJECT message with 5GMM cause #81 "Selected N3IWF is not compatible with the allowed NSSAI" and may provide information for a suitable N3IWF in the REGISTRATION REJECT message indicating the suitable N3IWF that is compatible with the requested NSSAI.

If the AMF receives the mobility and periodic registration update request over non-3GPP access and detects that the TNGF used by the UE is not compatible with the allowed NSSAI and the UE has indicated its support for slice-based TNGF selection in the REGISTRATION REQUEST message, the AMF may send a REGISTRATION REJECT message with 5GMM cause #82 "Selected TNGF is not compatible with the allowed NSSAI" and may provide information for a suitable TNAN in the TNAN information IE in the REGISTRATION REJECT message indicating the suitable TNGF that is compatible with the requested NSSAI.

If the AMF received multiple TAIs from the satellite NG-RAN as described in 3GPP TS 23.501 [8], and determines that, by UE subscription and operator's preferences, all of the received TAIs are forbidden for roaming or for regional provision of service, the AMF shall include the TAI(s) in:

a) the Forbidden TAI(s) for the list of "5GS forbidden tracking areas for roaming" IE; or

b) the Forbidden TAI(s) for the list of "5GS forbidden tracking areas for regional provision of service" IE; or

c) both;

in the REGISTRATION REJECT message.

Regardless of the 5GMM cause value received in the REGISTRATION REJECT message via satellite NG-RAN,

- if the UE receives the Forbidden TAI(s) for the list of "5GS forbidden tracking areas for roaming" IE in the REGISTRATION REJECT message and if the TAI(s) included in the IE is not part of the list of "5GS forbidden tracking areas for roaming", the UE shall store the TAI(s) belonging to the serving PLMN or equivalent PLMN(s) and ignore the TAI(s) which do not belong to the serving PLMN or equivalent PLMN(s) included in the IE, if not already stored, into the list of "5GS forbidden tracking areas for roaming"; and

- if the UE receives the Forbidden TAI(s) for the list of "5GS forbidden tracking areas for regional provision of service" IE in the REGISTRATION REJECT message and if the TAI(s) included in the IE is not part of the list of "5GS forbidden tracking areas for regional provision of service", the UE shall store the TAI(s) belonging to the serving PLMN or equivalent PLMN(s) and ignore the TAI(s) which do not belong to the serving PLMN or equivalent PLMN(s) included in the IE, if not already stored, into the list of "5GS forbidden tracking areas for regional provision of service".

In a shared network, the UE shall construct the TAI of the cell from one of the PLMN identities as specified in 3GPP TS 23.122 [5] and the TAC received on the broadcast system information. Whenever a REGISTRATION REJECT message is received by the UE:

- with the 5GMM cause #11 "PLMN not allowed", #36 "IAB-node operation not authorized" or #73 "Serving network not authorized", the chosen PLMN identity shall be stored in the "forbidden PLMN list" and if the UE is configured to use timer T3245 (see 3GPP TS 24.368 [17] or 3GPP TS 31.102 [22]) then the UE shall start timer T3245 and proceed as described in subclause 5.3.19A;

- with the 5GMM cause #12 "tracking area not allowed", #13 "roaming not allowed in this tracking area", #15 "no suitable cells in tracking Area", or #62 "No network slices available", the constructed TAI shall be stored in the suitable list; or

- as a response to registration procedure for mobility registration update initiated in 5GMM-CONNECTED mode, the UE need not update forbidden lists with the selected PLMN identity or the constructed TAI, respectively.

In a shared network, the UE shall construct the TAI of the cell from one of the SNPN identities as specified in 3GPP TS 23.122 [5] constructing the TAI from the PLMN identity part of the SNPN identity and the TAC received on the broadcast system information. Whenever a REGISTRATION REJECT message is received by the UE:

- with the 5GMM cause #36 "IAB-node operation not authorized" or #74 "Temporarily not authorized for this SNPN", the chosen SNPN identity shall be stored in the "temporarily forbidden SNPNs" list, "temporarily forbidden SNPNs for access for localized services in SNPN" list if the SNPN is an SNPN selected for localized services in SNPN (see 3GPP TS 23.122 [5]) or "temporarily forbidden SNPNs for onboarding services in SNPN" list if the UE is registered for onboarding services in SNPN and if the UE is configured to use timer T3245 (see 3GPP TS 24.368 [17] or 3GPP TS 31.102 [22]) then the UE shall start timer T3245 and proceed as described in subclause 5.3.19A;

- with the 5GMM cause #75 "Permanently not authorized for this SNPN", the chosen SNPN identity shall be stored in the "permanently forbidden SNPNs", "permanently forbidden SNPNs for access for localized services in SNPN" list if the SNPN is an SNPN selected for localized services in SNPN (see 3GPP TS 23.122 [5]) for the selected entry of the "list of subscriber data" or the selected PLMN subscription or "permanently forbidden SNPNs for onboarding services in SNPN" if the UE is registered for onboarding services in SNPN and if the UE is configured to use timer T3245 (see 3GPP TS 24.368 [17] or 3GPP TS 31.102 [22]) then the UE shall start timer T3245 and proceed as described in subclause 5.3.19A;

- with the 5GMM cause #12 "tracking area not allowed", #13 "roaming not allowed in this tracking area", #15 "no suitable cells in tracking Area", or #62 "No network slices available", the constructed TAI shall be stored in the suitable list; or

- as a response to registration procedure for mobility registration update initiated in 5GMM-CONNECTED mode, the UE need not update forbidden lists with the selected SNPN identity or the constructed TAI, respectively.

If

a) the UE indicates support of the RAT utilization control in the REGISTRATION REQUEST message over 3GPP access;

b) the network decides to apply the RAT utilization control based on the operator policy, and

c) the secure exchange of NAS messages via a NAS signalling connection is established between the UE and the AMF;

the AMF shall send the integrity protected REGISTRATION REJECT message with the 5GMM cause value set to #15 "No suitable cells in tracking area" and include the RAT utilization control IE. In the RAT utilization control IE, the AMF shall indicate that the access technology of the NG-RAN cell on which the REGISTRATION REQUEST message was received is restricted.

NOTE 4B: Other restricted access technologies can be indicated in the RAT utilization control IE, if any.

Furthermore, the UE shall take the following actions depending on the 5GMM cause value received in the REGISTRATION REJECT message.

#3 (Illegal UE); or

#6 (Illegal ME).

The UE shall set the 5GS update status to 5U3 ROAMING NOT ALLOWED (and shall store it according to subclause 5.1.3.2.2) and shall delete any 5G-GUTI, last visited registered TAI, TAI list and ngKSI.

In case of PLMN, the UE shall consider the USIM as invalid for 5GS services until switching off, the UICC containing the USIM is removed or the timer T3245 expires as described in subclause 5.3.19a.1.

In case of SNPN, if the UE is not registered for onboarding services in SNPN and the UE does not support access to an SNPN using credentials from a credentials holder and does not support equivalent SNPNs, the UE shall consider the selected entry of the "list of subscriber data" with the SNPN identity of the current SNPN as invalid until the UE is switched off, the entry is updated or the timer T3245 expires as described in subclause 5.3.19a.2. In case of SNPN, if the UE supports access to an SNPN using credentials from a credentials holder, equivalent SNPNs, or both, the UE shall consider the selected entry of the "list of subscriber data" as invalid for 3GPP access until the UE is switched off, the entry is updated or the timer T3245 expires as described in subclause 5.3.19a.2. Additionally, if EAP based primary authentication and key agreement procedure using EAP-AKA' or 5G AKA based primary authentication and key agreement procedure was performed in the current SNPN, the UE shall consider the USIM as invalid for the current SNPN until switching off, the UICC containing the USIM is removed or the timer T3245 expires as described in subclause 5.3.19a.2.

If the UE is not registered for onboarding services in SNPN, the UE shall delete the list of equivalent PLMNs (if any) or the list of equivalent SNPNs (if any), and shall move to 5GMM-DEREGISTERED.NO-SUPI state. If the message has been successfully integrity checked by the NAS, then the UE shall:

1) set the counter for "SIM/USIM considered invalid for GPRS services" events and the counter for "USIM considered invalid for 5GS services over non-3GPP access" events to UE implementation-specific maximum value in case of PLMN if the UE maintains these counters;

2) set the counter for "the entry for the current SNPN considered invalid for 3GPP access" events and the counter for "the entry for the current SNPN considered invalid for non-3GPP access" events to UE implementation-specific maximum value in case of SNPN if the UE maintains these counters; and

If the message was received via 3GPP access and the UE is operating in single-registration mode, the UE shall handle the EMM parameters EMM state, EPS update status, 4G-GUTI, last visited registered TAI, TAI list and eKSI as specified in 3GPP TS 24.301 [15] for the case when the normal tracking area updating procedure is rejected with the EMM cause with the same value. The USIM shall be considered as invalid also for non-EPS services until switching off or the UICC containing the USIM is removed or the timer T3245 expires as described in subclause 5.3.7a of 3GPP TS 24.301 [15]. If the UE is in EMM-REGISTERED state, the UE shall move to EMM-DEREGISTERED state. If the message has been successfully integrity checked by the NAS and the UE maintains a counter for "SIM/USIM considered invalid for non-GPRS services", then the UE shall set this counter to UE implementation-specific maximum value.

If the UE is registered for onboarding services in SNPN, the UE shall reset the registration attempt counter, store the SNPN identity in the "permanently forbidden SNPNs for onboarding services in SNPN" list, enter state 5GMM-DEREGISTERED.PLMN-SEARCH, and perform an SNPN selection or an SNPN selection for onboarding services according to 3GPP TS 23.122 [5]. If the message has been successfully integrity checked by the NAS, the UE shall set the SNPN-specific attempt counter for the current SNPN to the UE implementation-specific maximum value.

If the message has been successfully integrity checked by the NAS and the UE also supports the registration procedure over the other access, the UE shall in addition handle 5GMM parameters and 5GMM state for this access, as described for this 5GMM cause value.

#7 (5GS services not allowed).

The UE shall set the 5GS update status to 5U3 ROAMING NOT ALLOWED (and shall store it according to subclause 5.1.3.2.2) and shall delete any 5G-GUTI, last visited registered TAI, TAI list and ngKSI.

In case of PLMN, the UE shall consider the USIM as invalid for 5GS services until switching off, the UICC containing the USIM is removed or the timer T3245 expires as described in subclause 5.3.19a.1;

In case of SNPN, if the UE is not registered for onboarding services in SNPN and the UE does not support access to an SNPN using credentials from a credentials holder and does not support equivalent SNPNs, the UE shall consider the selected entry of the "list of subscriber data" with the SNPN identity of the current SNPN as invalid for 5GS services until the UE is switched off, the entry is updated or the timer T3245 expires as described in subclause 5.3.19a.2. In case of SNPN, if the UE is not registered for onboarding services in SNPN and the UE supports access to an SNPN using credentials from a credentials holder, equivalent SNPNs, or both, the UE shall consider the selected entry of the "list of subscriber data" as invalid for 3GPP access until the UE is switched off, the entry is updated or the timer T3245 expires as described in subclause 5.3.19a.2. Additionally, if EAP based primary authentication and key agreement procedure using EAP-AKA' or 5G AKA based primary authentication and key agreement procedure was performed in the current SNPN, the UE shall consider the USIM as invalid for the current SNPN until switching off or the UICC containing the USIM is removed or the timer T3245 expires as described in subclause 5.3.19a.2.

If the UE is not registered for onboarding services in SNPN, the UE shall move to 5GMM-DEREGISTERED.NO-SUPI state. If the message has been successfully integrity checked by the NAS, then the UE shall:

1) set the counter for "SIM/USIM considered invalid for GPRS services" events and the counter for "USIM considered invalid for 5GS services over non-3GPP access" events to UE implementation-specific maximum value in case of PLMN if the UE maintains these counters;

2) set the counter for "the entry for the current SNPN considered invalid for 3GPP access" events and the counter for "the entry for the current SNPN considered invalid for non-3GPP access" events to UE implementation-specific maximum value in case of SNPN if the UE maintains these counters; and

If the message was received via 3GPP access and the UE is operating in single-registration mode, the UE shall handle the EMM parameters EMM state, EPS update status, 4G-GUTI, last visited registered TAI, TAI list and eKSI as specified in 3GPP TS 24.301 [15] for the case when the normal tracking area updating procedure is rejected with the EMM cause with the same value.

If the UE is registered for onboarding services in SNPN, the UE shall reset the registration attempt counter, store the SNPN identity in the "permanently forbidden SNPNs for onboarding services in SNPN" list, enter state 5GMM-DEREGISTERED.PLMN-SEARCH, and perform an SNPN selection or an SNPN selection for onboarding services according to 3GPP TS 23.122 [5]. If the message has been successfully integrity checked by the NAS, the UE shall set the SNPN-specific attempt counter for the current SNPN to the UE implementation-specific maximum value.

If the message has been successfully integrity checked by the NAS and the UE also supports the registration procedure over the other access, the UE shall in addition handle 5GMM parameters and 5GMM state for this access, as described for this 5GMM cause value.

#9 (UE identity cannot be derived by the network).

The UE shall set the 5GS update status to 5U2 NOT UPDATED (and shall store it according to subclause 5.1.3.2.2) and shall delete any 5G-GUTI, last visited registered TAI, TAI list and ngKSI. The UE shall enter the state 5GMM-DEREGISTERED.

If the UE has initiated the registration procedure in order to enable performing the service request procedure for emergency services fallback, the UE shall attempt to select an E-UTRA cell connected to EPC or 5GCN according to the domain priority and selection rules specified in 3GPP TS 23.167 [6]. If the UE finds a suitable E-UTRA cell, it then proceeds with the appropriate EMM or 5GMM procedures. If the UE operating in single-registration mode has changed to S1 mode, it shall disable the N1 mode capability for 3GPP access.

If the rejected request was neither for initiating an emergency PDU session nor for emergency services fallback, the UE shall subsequently, automatically initiate the initial registration procedure.

NOTE 5: User interaction is necessary in some cases when the UE cannot re-establish the PDU session(s) automatically.

If the message was received via 3GPP access and the UE is operating in single-registration mode, the UE shall handle the EMM parameters EMM state, EPS update status, 4G-GUTI, last visited registered TAI, TAI list and eKSI as specified in 3GPP TS 24.301 [15] for the case when the normal tracking area updating procedure is rejected with the EMM cause with the same value.

#10 (implicitly de-registered).

The UE shall enter the state 5GMM-DEREGISTERED.NORMAL-SERVICE. The UE shall delete any mapped 5G NAS security context or partial native 5G NAS security context.

If the UE has initiated the registration procedure in order to enable performing the service request procedure for emergency services fallback, the UE shall attempt to select an E-UTRA cell connected to EPC or 5GCN according to the domain priority and selection rules specified in 3GPP TS 23.167 [6]. If the UE finds a suitable E-UTRA cell, it then proceeds with the appropriate EMM or 5GMM procedures. If the UE operating in single-registration mode has changed to S1 mode, it shall disable the N1 mode capability for 3GPP access.

If the rejected request was neither for initiating an emergency PDU session nor for emergency services fallback, the UE shall perform a new registration procedure for initial registration.

NOTE 6: User interaction is necessary in some cases when the UE cannot re-establish the PDU session(s) automatically.

If the message was received via 3GPP access and the UE is operating in single-registration mode, the UE shall handle the EMM state as specified in 3GPP TS 24.301 [15] for the case when the normal tracking area updating procedure is rejected with the EMM cause with the same value.

#11 (PLMN not allowed).

This cause value received from a cell belonging to an SNPN and the UE is operating in SNPN access operation mode is considered as an abnormal case and the behaviour of the UE is specified in subclause 5.5.1.3.7.

The UE shall set the 5GS update status to 5U3 ROAMING NOT ALLOWED (and shall store it according to subclause 5.1.3.2.2) and shall delete any 5G-GUTI, last visited registered TAI, TAI list and ngKSI. The UE shall store the PLMN identity in the forbidden PLMN list as specified in subclause 5.3.13A and if the UE is configured to use timer T3245 then the UE shall start timer T3245 and proceed as described in subclause 5.3.19a.1, delete the list of equivalent PLMNs, reset the registration attempt counter. For 3GPP access, the UE shall enter the state 5GMM-DEREGISTERED.PLMN-SEARCH and perform a PLMN selection according to 3GPP TS 23.122 [5]. For non-3GPP access the UE shall enter state 5GMM-DEREGISTERED.LIMITED-SERVICE and perform network selection as defined in 3GPP TS 24.502 [18]. If the message has been successfully integrity checked by the NAS and the UE maintains the PLMN-specific attempt counter and the PLMN-specific attempt counter for non-3GPP access for that PLMN, the UE shall set the PLMN-specific attempt counter and the PLMN-specific attempt counter for non-3GPP access for that PLMN to the UE implementation-specific maximum value.

If the message was received via 3GPP access and the UE is operating in single-registration mode, the UE shall in addition handle the EMM parameters EMM state, EPS update status, 4G-GUTI, last visited registered TAI, TAI list, eKSI and tracking area updating attempt counter as specified in 3GPP TS 24.301 [15] for the case when the normal tracking area updating procedure is rejected with the EMM cause with the same value.

If the message has been successfully integrity checked by the NAS and the UE also supports the registration procedure over the other access to the same PLMN, the UE shall in addition handle 5GMM parameters and 5GMM state for this access, as described for this 5GMM cause value.

If the UE receives the Disaster return wait range IE in the REGISTRATION REJECT message and the UE supports MINT, the UE shall delete the disaster return wait range stored in the ME, if any, and store the disaster return wait range included in the Disaster return wait range IE in the ME.

#12 (Tracking area not allowed).

The UE shall set the 5GS update status to 5U3 ROAMING NOT ALLOWED (and shall store it according to subclause 5.1.3.2.2) and shall delete last visited registered TAI and TAI list. If the UE is not registering or has not registered to the same PLMN over both 3GPP access and non-3GPP access, the UE shall additionally delete 5G-GUTI and ngKSI. Additionally, the UE shall reset the registration attempt counter.

If:

1) the UE is not operating in SNPN access operation mode and the Forbidden TAI(s) for the list of "5GS forbidden tracking areas for regional provision of service" IE is not included in the REGISTRATION REJECT message, the UE shall store the current TAI in the list of "5GS forbidden tracking areas for regional provision of service" and enter the state 5GMM-DEREGISTERED.LIMITED-SERVICE. If the REGISTRATION REJECT message is not integrity protected, the UE shall memorize the current TAI was stored in the list of "5GS forbidden tracking areas for regional provision of service" for non-integrity protected NAS reject message; or

2) the UE is operating in SNPN access operation mode, the UE shall store the current TAI in the list of "5GS forbidden tracking areas for regional provision of service" for the current SNPN and the selected entry of the "list of subscriber data" or the selected PLMN subscription, and enter the state 5GMM-DEREGISTERED.LIMITED-SERVICE. If the REGISTRATION REJECT message is not integrity protected, the UE shall memorize the current TAI was stored in the list of "5GS forbidden tracking areas for regional provision of service" for the current SNPN and the selected entry of the "list of subscriber data" or the selected PLMN subscription, for non-integrity protected NAS reject message. If the SNPN is an SNPN selected for localized services in SNPN (see 3GPP TS 23.122 [5] subclause 3.9), the UE shall store the current TAI in the list of "5GS forbidden tracking areas for regional provision of service" for the current SNPN and the selected entry of the "list of subscriber data" or the selected PLMN subscription, along with the GIN(s) broadcasted by the SNPN if any.

If the message was received via 3GPP access and the UE is operating in single-registration mode, the UE shall handle the EMM parameters EMM state, EPS update status, 4G-GUTI, last visited registered TAI, TAI list, eKSI and tracking area updating attempt counter as specified in 3GPP TS 24.301 [15] for the case when the normal tracking area updating procedure is rejected with the EMM cause with the same value.

#13 (Roaming not allowed in this tracking area).

The UE shall set the 5GS update status to 5U3 ROAMING NOT ALLOWED (and shall store it according to subclause 5.1.3.2.2). If the UE is not registering or has not registered to the same PLMN over both 3GPP access and non-3GPP access the UE shall delete the list of equivalent PLMNs (if available) or the list of equivalent SNPNs (if available). The UE shall reset the registration attempt counter. For 3GPP acess the UE shall change to state 5GMM-REGISTERED.PLMN-SEARCH, and for non-3GPP access the UE shall change to state 5GMM-REGISTERED.LIMITED-SERVICE.

If the UE is registered in S1 mode and operating in dual-registration mode, the PLMN that the UE chooses to register in is specified in subclause 4.8.3. Otherwise if:

1) the UE is not operating in SNPN access operation mode and the Forbidden TAI(s) for the list of "5GS forbidden tracking areas for roaming" IE is not included in the REGISTRATION REJECT message, the UE shall store the current TAI in the list of "5GS forbidden tracking areas for roaming" and shall remove the current TAI from the stored TAI list if present. If the REGISTRATION REJECT message is not integrity protected, the UE shall memorize the current TAI was stored in the list of "5GS forbidden tracking areas for roaming" for non-integrity protected NAS reject message; or

2) the UE is operating in SNPN access operation mode, the UE shall store the current TAI in the list of "5GS forbidden tracking areas for roaming" for the current SNPN and the selected entry of the "list of subscriber data" or the selected PLMN subscription. If the REGISTRATION REJECT message is not integrity protected, the UE shall memorize the current TAI was stored in the list of "5GS forbidden tracking areas for roaming" for the current SNPN and the selected entry of the "list of subscriber data" or the selected PLMN subscription, for non-integrity protected NAS reject message. If the SNPN is an SNPN selected for localized services in SNPN (see 3GPP TS 23.122 [5] subclause 3.9), the UE shall store the current TAI in the list of "5GS forbidden tracking areas for roaming" for the current SNPN and the selected entry of the "list of subscriber data" or the selected PLMN subscription, along with the GIN(s) broadcasted by the SNPN if any.

For 3GPP access the UE shall perform a PLMN selection or SNPN selection according to 3GPP TS 23.122 [5], and for non-3GPP access the UE shall perform network selection as defined in 3GPP TS 24.502 [18].

If the message was received via 3GPP access and the UE is operating in single-registration mode, the UE shall handle the EMM parameters EMM state, EPS update status and tracking area updating attempt counter as specified in 3GPP TS 24.301 [15] for the case when the normal tracking area updating procedure is rejected with the EMM cause with the same value.

If the UE receives the Disaster return wait range IE in the REGISTRATION REJECT message and the UE supports MINT, the UE shall delete the disaster return wait range stored in the ME, if any, and store the disaster return wait range included in the Disaster return wait range IE in the ME.

#15 (No suitable cells in tracking area).

The UE shall set the 5GS update status to 5U3 ROAMING NOT ALLOWED (and shall store it according to subclause 5.1.3.2.2). The UE shall reset the registration attempt counter. Additionally, the UE shall enter the state 5GMM-REGISTERED.LIMITED-SERVICE and:

1) if the Extended 5GMM cause IE with value "Satellite NG-RAN not allowed in PLMN" is included in the REGISTRATION REJECT message,

i) the message has been successfully integrity checked by the NAS and the UE is configured for "Satellite Disabling Allowed for 5GMM cause #15" as specified in 3GPP TS 24.368 [17] or 3GPP TS 31.102 [22], then the UE shall disable satellite NG-RAN capability (see subclause 4.9.4); or

ii) otherwise, the UE shall ignore the Extended 5GMM cause IE;

2) if the RAT utilization control IE is included in the REGISTRATION REJECT message,

i) the message has been successfully integrity checked by the NAS; the UE shall store the received RAT utilization control information together with the PLMN identity of the current PLMN in the list of "PLMNs with associated RAT restrictions" and replace the previously stored one associated with the current PLMN, if any, with the newly received RAT utilization control information; or

ii) otherwise, the UE shall ignore the RAT utilization control IE; and

3) if the UE has initiated the registration procedure in order to enable performing the service request procedure for emergency services fallback, the UE shall attempt to select an E-UTRA cell connected to the EPC or the 5GCN according to the emergency services support indicator (see 3GPP TS 36.331 [25A]). If the UE finds a suitable E-UTRA cell, it then proceeds with the appropriate EMM or 5GMM procedures. If the UE operating in single-registration mode has changed to S1 mode, it shall disable the N1 mode capability for 3GPP access;

otherwise, the UE shall search for a suitable cell in another tracking area according to 3GPP TS 38.304 [28] or 3GPP TS 36.304 [25C].

If:

1) the UE is not operating in SNPN access operation mode and the Forbidden TAI(s) for the list of "5GS forbidden tracking areas for roaming" IE is not included in the REGISTRATION REJECT message, the UE shall store the current TAI in the list of "5GS forbidden tracking areas for roaming" and shall remove the current TAI from the stored TAI list, if present. If the REGISTRATION REJECT message is not integrity protected, the UE shall memorize the current TAI was stored in the list of "5GS forbidden tracking areas for roaming" for non-integrity protected NAS reject message; or

2) the UE is operating in SNPN access operation mode, the UE shall store the current TAI in the list of "5GS forbidden tracking areas for roaming" for the current SNPN and the selected entry of the "list of subscriber data" or the selected PLMN subscription, and shall remove the current TAI from the stored TAI list, if present. If the REGISTRATION REJECT message is not integrity protected, the UE shall memorize the current TAI was stored in the list of "5GS forbidden tracking areas for roaming" for the current SNPN and the selected entry of the "list of subscriber data" or the selected PLMN subscription, for non-integrity protected NAS reject message. If the SNPN is an SNPN selected for localized services in SNPN (see 3GPP TS 23.122 [5] subclause 3.9), the UE shall store the current TAI in the list of "5GS forbidden tracking areas for roaming" for the current SNPN and the selected entry of the "list of subscriber data" or the selected PLMN subscription, along with the GIN(s) broadcasted by the SNPN if any.

If the message was received via 3GPP access and the UE is operating in single-registration mode, the UE shall handle the EMM parameters EMM state, EPS update status and tracking area updating attempt counter as specified in 3GPP TS 24.301 [15] for the case when the normal tracking area updating procedure is rejected with the EMM cause with the same value.

If received over non-3GPP access the cause shall be considered as an abnormal case and the behaviour of the UE for this case is specified in subclause 5.5.1.3.7.

#22 (Congestion).

If the T3346 value IE is present in the REGISTRATION REJECT message and the value indicates that this timer is neither zero nor deactivated, the UE shall proceed as described below, otherwise it shall be considered as an abnormal case and the behaviour of the UE for this case is specified in subclause 5.5.1.3.7.

The UE shall abort the registration procedure for mobility and periodic registration update. If the rejected request was not for initiating an emergency PDU session, the UE shall set the 5GS update status to 5U2 NOT UPDATED, reset the registration attempt counter and change to state 5GMM-REGISTERED.ATTEMPTING-REGISTRATION-UPDATE.

The UE shall stop timer T3346 if it is running.

If the REGISTRATION REJECT message is integrity protected, the UE shall start timer T3346 with the value provided in the T3346 value IE.

If the REGISTRATION REJECT message is not integrity protected, the UE shall start timer T3346 with a random value from the default range specified in 3GPP TS 24.008 [12].

The UE stays in the current serving cell and applies the normal cell reselection process. The registration procedure for mobility and periodic registration update is started, if still necessary, when timer T3346 expires or is stopped.

If the message was received via 3GPP access and the UE is operating in single-registration mode, the UE shall handle the EMM parameters EMM state, EPS update status and tracking area updating attempt counter as specified in 3GPP TS 24.301 [15] for the case when the normal tracking area updating procedure is rejected with the EMM cause with the same value.

If the registration procedure for mobility and periodic registration update was initiated for an MO MMTEL voice call (i.e. access category 4), or an MO MMTEL video call (i.e. access category 5), or an MO IMS registration related signalling (i.e. access category 9) or for NAS signalling connection recovery during an ongoing MO MMTEL voice call (i.e. access category 4), or during an ongoing MO MMTEL video call (i.e. access category 5) or during an ongoing MO IMS registration related signalling (i.e. access category 9), then a notification that the request was not accepted due to network congestion shall be provided to upper layers.

NOTE 8: Upper layers specified in 3GPP TS 24.173 [13C] and 3GPP TS 24.229 [14] handle the notification that the request was not accepted due to network congestion.

If the UE is registered for onboarding services in SNPN, the UE may enter the state 5GMM-DEREGISTERED.PLMN-SEARCH and perform an SNPN selection or an SNPN selection for onboarding services according to 3GPP TS 23.122 [5].

#27 (N1 mode not allowed).

The UE shall set the 5GS update status to 5U3 ROAMING NOT ALLOWED (and shall store it according to subclause 5.1.3.2.2). Additionally, the UE shall reset the registration attempt counter and shall enter the state 5GMM-REGISTERED.LIMITED-SERVICE. If the message has been successfully integrity checked by the NAS, the UE shall set:

1) the PLMN-specific N1 mode attempt counter for 3GPP access and the PLMN-specific N1 mode attempt counter for non-3GPP access for that PLMN in case of PLMN; or

2) the SNPN-specific attempt counter for 3GPP access for the current SNPN and the SNPN-specific attempt counter for non-3GPP access for the current SNPN in case of SNPN;

to the UE implementation-specific maximum value.

The UE shall disable the N1 mode capability for the specific access type for which the message was received (see subclause 4.9).

If the message has been successfully integrity checked by the NAS, the UE shall disable the N1 mode capability also for the other access type (see subclause 4.9).

If the message was received via 3GPP access and the UE is operating in single-registration mode, the UE shall in addition set the EPS update status to EU3 ROAMING NOT ALLOWED. Additionally, the UE shall reset the tracking area updating attempt counter and enter the state EMM-REGISTERED.

#31 (Redirection to EPC required).

5GMM cause #31 received by a UE that has not indicated support for CIoT optimizations or not indicated support for S1 mode or received by a UE over non-3GPP access is considered an abnormal case and the behaviour of the UE is specified in subclause 5.5.1.3.7.

This cause value received from a cell belonging to an SNPN and the UE is operating in SNPN access operation mode is considered as an abnormal case and the behaviour of the UE is specified in subclause 5.5.1.3.7.

The UE shall set the 5GS update status to 5U3 ROAMING NOT ALLOWED (and shall store it according to subclause 5.1.3.2.2). The UE shall reset the registration attempt counter and enter the state 5GMM- REGISTERED.LIMITED-SERVICE.

The UE shall enable the E-UTRA capability if it was disabled and disable the N1 mode capability for 3GPP access (see subclause 4.9.2).

If the message was received via 3GPP access and the UE is operating in single-registration mode, the UE shall handle the EMM parameters EMM state, EPS update status, and tracking area updating attempt counter as specified in 3GPP TS 24.301 [15] for the case when the normal tracking area updating procedure is rejected with the EMM cause with the same value.

#36 (IAB-node operation not authorized).

This cause value is only applicable when received over 3GPP access by a UE operating as an IAB-node. This cause value received from a 5G access network other than 3GPP access or received by a UE not operating as an IAB-node is considered as an abnormal case and the behaviour of the UE is specified in subclause 5.5.1.3.7.

The UE shall set the 5GS update status to 5U3 ROAMING NOT ALLOWED (and shall store it according to subclause 5.1.3.2.2) and shall delete any 5G-GUTI, last visited registered TAI, TAI list and ngKSI.

If:

1) the UE is not operating in SNPN access operation mode,

i) the UE shall delete the list of equivalent PLMNs and reset the registration attempt counter and store the PLMN identity in the forbidden PLMN list as specified in subclause 5.3.13A and if the UE is configured to use timer T3245 then the UE shall start timer T3245 and proceed as described in subclause 5.3.19a.1. The UE shall enter state 5GMM-DEREGISTERED.PLMN-SEARCH and perform a PLMN selection according to 3GPP TS 23.122 [5]. If the message has been successfully integrity checked by the NAS and the UE maintains the PLMN-specific attempt counter for 3GPP access for that PLMN, the UE shall set the PLMN-specific attempt counter for 3GPP access for that PLMN to the UE implementation-specific maximum value; and

ii) If the UE is operating in single-registration mode, the UE shall in addition handle the EMM parameters EMM state, EPS update status, 4G-GUTI, last visited registered TAI, TAI list, eKSI and attach attempt counter as specified in 3GPP TS 24.301 [15] for the case when the normal tracking area updating procedure is rejected with the EMM cause with the same value; or

2) the UE is operating in SNPN access operation mode,

i) the UE shall delete the list of equivalent SNPNs (if available). The UE shall reset the registration attempt counter store the SNPN identity in the "temporarily forbidden SNPNs" list or "temporarily forbidden SNPNs for access for localized services in SNPN" list if the SNPN is an SNPN selected for localized services in SNPN (see 3GPP TS 23.122 [5]) for 3GPP access and the selected entry of the "list of subscriber data" or the selected PLMN subscription, or in the "temporarily forbidden SNPNs for onboarding services in SNPN" list, if the UE is registered for onboarding services in SNPN, for 3GPP access. If the UE supports access to an SNPN using credentials from a credentials holder, the UE shall store the SNPN identity in the "temporarily forbidden SNPNs" list along with the GIN(s) broadcasted by the SNPN if any, for the selected entry of the "list of subscriber data" or the selected PLMN subscription. If the UE supports access to an SNPN providing access for localized services in SNPN and the access for localized services in SNPN has been enabled, the UE shall store the SNPN identity in the list of "temporarily forbidden SNPNs for access for localized services in SNPN" (if the SNPN is an SNPN selected for localized services in SNPN (see 3GPP TS 23.122 [5]) along with the GIN(s) broadcasted by the SNPN if any, for the selected entry of the "list of subscriber data" or the selected PLMN subscription. The UE shall enter state 5GMM-DEREGISTERED.PLMN-SEARCH and perform an SNPN selection according to 3GPP TS 23.122 [5]. If the message has been successfully integrity checked by the NAS, the UE shall set the SNPN attempt counter for 3GPP access for the current SNPN to the UE implementation-specific maximum value.

#62 (No network slices available).

The UE shall abort the registration procedure for mobility and periodic registration update procedure, set the 5GS update status to 5U2 NOT UPDATED and enter state 5GMM-REGISTERED.ATTEMPTING-REGISTRATION-UPDATE. Additionally, the UE shall reset the registration attempt counter.

The UE receiving the rejected NSSAI in the REGISTRATION REJECT message takes the following actions based on the rejection cause in the rejected S-NSSAI(s):

"S-NSSAI not available in the current PLMN or SNPN"

The UE shall add the rejected S-NSSAI(s) in the rejected NSSAI for the current PLMN or SNPN as specified in subclause 4.6.2.2 and shall not attempt to use this S-NSSAI(s) in the current PLMN or SNPN over any access until switching off the UE, the UICC containing the USIM is removed, an entry of the "list of subscriber data" with the SNPN identity of the current SNPN is updated, or the rejected S-NSSAI(s) are removed as described in subclause 4.6.2.2.

"S-NSSAI not available in the current registration area"

The UE shall add the rejected S-NSSAI(s) in the rejected NSSAI for the current registration area as specified in subclause 4.6.2.2 and shall not attempt to use this S-NSSAI(s) in the current registration area over the current access until switching off the UE, the UE moving out of the current registration area, the UICC containing the USIM is removed, an entry of the "list of subscriber data" with the SNPN identity of the current SNPN is updated, or the rejected S-NSSAI(s) are removed as described in subclause 4.6.2.2.

"S-NSSAI not available due to the failed or revoked network slice-specific authentication and authorization"

The UE shall store the rejected S-NSSAI(s) in the rejected NSSAI for the failed or revoked NSSAA as specified in subclause 4.6.2.2 and shall not attempt to use this S-NSSAI in the current PLMN or SNPN over any access until switching off the UE, the UICC containing the USIM is removed, the entry of the "list of subscriber data" with the SNPN identity of the current SNPN is updated, or the rejected S-NSSAI(s) are removed as described in subclause 4.6.1 and 4.6.2.2.

"S-NSSAI not available due to maximum number of UEs reached"

Unless the back-off timer value received along with the S-NSSAI is zero, the UE shall add the rejected S-NSSAI(s) in the rejected NSSAI for the maximum number of UEs reached as specified in subclause 4.6.2.2 and shall not attempt to use this S-NSSAI in the current PLMN or SNPN over the current access until switching off the UE, the UICC containing the USIM is removed, the entry of the "list of subscriber data" with the SNPN identity of the current SNPN is updated, or the rejected S-NSSAI(s) are removed as described in subclauses 4.6.1 and 4.6.2.2.

NOTE 8: If the back-off timer value received along with the S-NSSAI in the rejected NSSAI for the maximum number of UEs reached is zero as specified in subclause 10.5.7.4a of 3GPP TS 24.008 [12], the UE does not consider the S-NSSAI as the rejected S-NSSAI.

If there is one or more S-NSSAIs in the rejected NSSAI with the rejection cause "S-NSSAI not available due to maximum number of UEs reached", then for each S-NSSAI, the UE shall behave as follows:

a) stop the timer T3526 associated with the S-NSSAI, if running;

b) start the timer T3526 with:

1) the back-off timer value received along with the S-NSSAI, if a back-off timer value is received along with the S-NSSAI that is neither zero nor deactivated; or

2) an implementation specific back-off timer value, if no back-off timer value is received along with the S-NSSAI; and

c) remove the S-NSSAI from the rejected NSSAI for the maximum number of UEs reached when the timer T3526 associated with the S-NSSAI expires.

If the UE has an allowed NSSAI or configured NSSAI and:

1) at least S-NSSAI of the allowed NSSAI or configured NSSAI is not included in the rejected NSSAI, the UE may stay in the current serving cell, apply the normal cell reselection process and start a registration procedure for mobility and periodic registration update with a requested NSSAI that includes any S-NSSAI from the allowed S-NSSAI or the configured NSSAI that is not in the rejected NSSAI.

2) all the S-NSSAI(s) in the allowed NSSAI and configured NSSAI are rejected and at least one S-NSSAI is rejected due to "S-NSSAI not available in the current registration area" and:

i) the REGISTRATION REJECT message is integrity protected, the UE is not operating in SNPN access operation mode and the Forbidden TAI(s) for the list of "5GS forbidden tracking areas for roaming" IE is not included in the REGISTRATION REJECT message and the REGISTRATION REJECT message is received from one of the TAI(s) in the current registration area, the UE shall store the TAI(s) belonging to the registration area in the list of "5GS forbidden tracking areas for roaming". If the REGISTRATION REJECT message is received from a TAI not in the current registration area, the UE shall store the current TAI in the list of "5GS forbidden tracking areas for roaming". The UE shall enter the state 5GMM-REGISTERED.LIMITED-SERVICE. The UE shall search for a suitable cell in another tracking area according to 3GPP TS 38.304 [28] or 3GPP TS 36.304 [25C]; or

ii) the REGISTRATION REJECT message is integrity protected and the UE is operating in SNPN access operation mode and the REGISTRATION REJECT message is received from one of the TAI(s) in the current registration area, the UE shall store the TAI(s) belonging to current registration area in the list of "5GS forbidden tracking areas for roaming" for the current SNPN. If the REGISTRATION REJECT message is received from a TAI not in the current registration area, the UE shall store the current TAI in the list of "5GS forbidden tracking areas for roaming". If the UE supports access to an SNPN using credentials from a credentials holder, equivalent SNPNs or both, the selected entry of the "list of subscriber data" or the selected PLMN subscription, and enter the state 5GMM-REGISTERED.LIMITED-SERVICE. The UE shall search for a suitable cell in another tracking area according to 3GPP TS 38.304 [28] or 3GPP TS 36.304 [25C].

3) otherwise, the UE may perform a PLMN selection or SNPN selection according to 3GPP TS 23.122 [5] and additionally, the UE may disable the N1 mode capability for the current PLMN or SNPN if the UE does not have an allowed NSSAI and each S-NSSAI in the configured NSSAI, if available, was rejected with cause "S-NSSAI not available in the current PLMN or SNPN" or "S-NSSAI not available due to the failed or revoked network slice-specific authentication and authorization" as described in subclause 4.9.

If the UE has neither allowed NSSAI for the current PLMN or SNPN nor configured NSSAI for the current PLMN or SNPN and,

1) if at least one S-NSSAI in the default configured NSSAI is not rejected, the UE may stay in the current serving cell, apply the normal cell reselection process, and start a registration procedure for mobility and periodic registration update with a requested NSSAI with that default configured NSSAI; or

2) if all the S-NSSAI(s) in the default configured NSSAI are rejected and at least one S-NSSAI is rejected due to "S-NSSAI not available in the current registration area",

i) if the REGISTRATION REJECT message is integrity protected and the UE is not operating in SNPN access operation mode and the REGISTRATION REJECT message is received from one of the TAI(s) in the current registration area, the UE shall store the TAI(s) belonging to current registration area in the list of "5GS forbidden tracking areas for roaming". If the REGISTRATION REJECT message is received from a TAI not in the current registration area, the UE shall store the current TAI in the list of "5GS forbidden tracking areas for roaming". The UE shall memorize the TAI(s) was stored in the list of "5GS forbidden tracking areas for roaming" for S-NSSAI is rejected due to "S-NSSAI not available in the current registration area" and enter the state 5GMM-REGISTERED.LIMITED-SERVICE. The UE shall search for a suitable cell in another tracking area according to 3GPP TS 38.304 [28] or 3GPP TS 36.304 [25C]; or

ii) If the REGISTRATION REJECT message is integrity protected and the UE is operating in SNPN access operation mode and the REGISTRATION REJECT message is received from one of the TAI(s) in the current registration area, the UE shall store the TAI(s) belonging to current registration area in the list of "5GS forbidden tracking areas for roaming". If the REGISTRATION REJECT message is received from a TAI not in the current registration area, the UE shall store the current TAI in the list of "5GS forbidden tracking areas for roaming". The UE shall memorize the TAI(s) was stored in the list of "5GS forbidden tracking areas for roaming" for S-NSSAI is rejected due to "S-NSSAI not available in the current registration area" for the current SNPN and, if the UE supports access to an SNPN using credentials from a credentials holder, equivalent SNPNs or both, the selected entry of the "list of subscriber data" or the selected PLMN subscription, and enter the state 5GMM-REGISTERED.LIMITED-SERVICE. The UE shall search for a suitable cell in another tracking area according to 3GPP TS 38.304 [28] or 3GPP TS 36.304 [25C].

3) otherwise, the UE may perform a PLMN selection or SNPN selection according to 3GPP TS 23.122 [5] and additionally, the UE may disable the N1 mode capability for the current PLMN or SNPN if each S-NSSAI in the default configured NSSAI was rejected with cause "S-NSSAI not available in the current PLMN or SNPN" or "S-NSSAI not available due to the failed or revoked network slice-specific authentication and authorization" as described in subclause 4.9.

If

1) the UE has allowed NSSAI for the current PLMN or SNPN or configured NSSAI for the current PLMN or SNPN or both and all the S-NSSAIs included in the allowed NSSAI or the configured NSSAI or both are rejected; or

2) the UE has neither allowed NSSAI for the current PLMN or SNPN nor configured NSSAI for the current PLMN or SNPN and all the S-NSSAIs included in the default configured NSSAI are rejected,

and the UE has rejected NSSAI for the maximum number of UEs reached, and the UE wants to obtain services in the current serving cell without performing a PLMN selection or SNPN selection, the UE may stay in the current serving cell and attempt to use the rejected S-NSSAI(s) for the maximum number of UEs reached in the current serving cell after the rejected S-NSSAI(s) are removed as described in subclause 4.6.2.2.

If the message was received via 3GPP access and the UE is operating in single-registration mode, the UE shall in addition set the EPS update status to EU2 NOT UPDATED, reset the tracking area updating attempt counter and enter the state EMM-REGISTERED.

#72 (Non-3GPP access to 5GCN not allowed).

When received over non-3GPP access the UE shall set the 5GS update status to 5U3 ROAMING NOT ALLOWED (and shall store it according to subclause 5.1.3.2.2) and shall delete last visited registered TAI and TAI list. If the UE is not registering or has not registered to the same PLMN over both 3GPP access and non-3GPP access, the UE shall additionally delete 5G-GUTI and ngKSI. Additionally, the UE shall reset the registration attempt counter and enter the state 5GMM-DEREGISTERED. If the message has been successfully integrity checked by the NAS, the UE shall set:

1) the PLMN-specific N1 mode attempt counter for non-3GPP access for that PLMN in case of PLMN; or

2) the SNPN-specific attempt counter for non-3GPP access for that SNPN in case of SNPN;

to the UE implementation-specific maximum value.

NOTE 10: The 5GMM sublayer states, the 5GMM parameters and the registration status are managed per access type independently, i.e. 3GPP access or non-3GPP access (see subclauses 4.7.2 and 5.1.3).

The UE shall disable the N1 mode capability for non-3GPP access (see subclause 4.9.3).

As an implementation option, the UE may enter the state 5GMM-DEREGISTERED.PLMN-SEARCH in order to perform a PLMN selection according to 3GPP TS 23.122 [5].

If received over 3GPP access the cause shall be considered as an abnormal case and the behaviour of the UE for this case is specified in subclause 5.5.1.3.7.

#73 (Serving network not authorized).

This cause value received from a cell belonging to an SNPN and the UE is operating in SNPN access operation mode is considered as an abnormal case and the behaviour of the UE is specified in subclause 5.5.1.3.7.

The UE shall set the 5GS update status to 5U3 ROAMING NOT ALLOWED (and shall store it according to subclause 5.1.3.2.2) and shall delete any 5G-GUTI, last visited registered TAI, TAI list and ngKSI. The UE shall delete the list of equivalent PLMNs, reset the registration attempt counter, store the PLMN identity in the forbidden PLMN list as specified in subclause 5.3.13A. For 3GPP access the UE shall enter state 5GMM-DEREGISTERED.PLMN-SEARCH in order to perform a PLMN selection according to 3GPP TS 23.122 [5], and for non-3GPP access the UE shall enter state 5GMM-DEREGISTERED.LIMITED-SERVICE and perform network selection as defined in 3GPP TS 24.502 [18]. If the message has been successfully integrity checked by the NAS, the UE shall set the PLMN-specific attempt counter and the PLMN-specific attempt counter for non-3GPP access for that PLMN to the UE implementation-specific maximum value.

If the message was received via 3GPP access and the UE is operating in single-registration mode, the UE shall in addition set the EPS update status to EU3 ROAMING NOT ALLOWED and shall delete any 4G-GUTI, last visited registered TAI, TAI list and eKSI. Additionally, the UE shall reset the tracking area updating attempt counter and enter the state EMM-DEREGISTERED.

#74 (Temporarily not authorized for this SNPN).

5GMM cause #74 is only applicable when received from a cell belonging to an SNPN and the UE is operating in SNPN access operation mode. 5GMM cause #74 received from a cell not belonging to an SNPN is considered as an abnormal case and the behaviour of the UE is specified in subclause 5.5.1.3.7.

The UE shall set the 5GS update status to 5U3 ROAMING NOT ALLOWED (and shall store it according to subclause 5.1.3.2.2) and shall delete any 5G-GUTI, last visited registered TAI, TAI list ngKSI and the list of equivalent SNPNs (if available). The UE shall reset the registration attempt counter and store the SNPN identity in the "temporarily forbidden SNPNs" list or "temporarily forbidden SNPNs for access for localized services in SNPN" list if the SNPN is an SNPN selected for localized services in SNPN (see 3GPP TS 23.122 [5]) for the specific access type for which the message was received and the selected entry of the "list of subscriber data" or the selected PLMN subscription, or in the "temporarily forbidden SNPNs for onboarding services in SNPN" list, if the UE is registered for onboarding services in SNPN, for the specific access type for which the message was received. If the UE supports access to an SNPN using credentials from a credentials holder, the UE shall store the SNPN identity in the "temporarily forbidden SNPNs" list along with the GIN(s) broadcasted by the SNPN if any, for the selected entry of the "list of subscriber data" or the selected PLMN subscription. If the UE supports access to an SNPN providing access for localized services in SNPN and the access for localized services in SNPN has been enabled, the UE shall store the SNPN identity in the list of "temporarily forbidden SNPNs for access for localized services in SNPN" (if the SNPN is an SNPN selected for localized services in SNPN (see 3GPP TS 23.122 [5]) along with the GIN(s) broadcasted by the SNPN if any, for the selected entry of the "list of subscriber data" or the selected PLMN subscription. If the UE is not registered for onboarding services in SNPN, for 3GPP access the UE shall enter state 5GMM-DEREGISTERED.PLMN-SEARCH and perform an SNPN selection according to 3GPP TS 23.122 [5] and for non-3GPP access the UE shall enter the state 5GMM-DEREGISTERED.LIMITED-SERVICE amd perform network selection as defined in 3GPP TS 24.502 [18]. If the UE is registered for onboarding services in SNPN, the UE shall enter state 5GMM-DEREGISTERED.PLMN-SEARCH and perform an SNPN selection or an SNPN selection for onboarding services according to 3GPP TS 23.122 [5]. If the message has been successfully integrity checked by the NAS, the UE shall set the SNPN-specific attempt counter for 3GPP access and the SNPN-specific attempt counter for non-3GPP access for the current SNPN to the UE implementation-specific maximum value.

If the message has been successfully integrity checked by the NAS and the UE also supports the registration procedure over the other access to the same SNPN, the UE shall in addition handle 5GMM parameters and 5GMM state for this access, as described for this 5GMM cause value.

#75 (Permanently not authorized for this SNPN).

5GMM cause #75 is only applicable when received from a cell belonging to an SNPN with a globally-unique SNPN identity and the UE is operating in SNPN access operation mode. 5GMM cause #75 received from a cell not belonging to an SNPN or a cell belonging to an SNPN with a non-globally-unique SNPN identity is considered as an abnormal case and the behaviour of the UE is specified in subclause 5.5.1.3.7.

The UE shall set the 5GS update status to 5U3 ROAMING NOT ALLOWED (and shall store it according to subclause 5.1.3.2.2) and shall delete any 5G-GUTI, last visited registered TAI, TAI list ngKSI and the list of equivalent SNPNs (if available). The UE shall reset the registration attempt counter and store the SNPN identity in the "permanently forbidden SNPNs" or "permanently forbidden SNPNs for access for localized services in SNPN" list if the SNPN is an SNPN selected for localized services in SNPN (see 3GPP TS 23.122 [5]) list for the specific access type for which the message was received and the selected entry of the "list of subscriber data" or the selected PLMN subscription, or in the "permanently forbidden SNPNs for onboarding services in SNPN" list, if the UE is registered for onboarding services in SNPN, for the specific access type for which the message was received. If the UE supports access to an SNPN using credentials from a credentials holder, the UE shall store the SNPN identity in the "permanently forbidden SNPNs" list along with the GIN(s) broadcasted by the SNPN if any, for the selected entry of the "list of subscriber data" or the selected PLMN subscription. If the UE supports access to an SNPN providing access for localized services in SNPN and the access for localized services in SNPN has been enabled, the UE shall store the SNPN identity in the list of "permanently forbidden SNPNs for access for localized services in SNPN" (if the SNPN is an SNPN selected for localized services in SNPN (see 3GPP TS 23.122 [5]) along with the GIN(s) broadcasted by the SNPN if any, for the selected entry of the "list of subscriber data" or the selected PLMN subscription. If the UE is not registered for onboarding services in SNPN, for 3GPP access the UE shall enter state 5GMM-DEREGISTERED.PLMN-SEARCH and perform an SNPN selection according to 3GPP TS 23.122 [5] and for non-3GPP access the UE shall enter the state 5GMM-DEREGISTERED.LIMITED-SERVICE amd perform network selection as defined in 3GPP TS 24.502 [18]. If the UE is registered for onboarding services in SNPN, the UE shall enter state 5GMM-DEREGISTERED.PLMN-SEARCH and perform an SNPN selection or an SNPN selection for onboarding services according to 3GPP TS 23.122 [5]. If the message has been successfully integrity checked by the NAS, the UE shall set the SNPN-specific attempt counter for 3GPP access and the SNPN-specific attempt counter for non-3GPP access for the current SNPN to the UE implementation-specific maximum value.

If the message has been successfully integrity checked by the NAS and the UE also supports the registration procedure over the other access to the same SNPN, the UE shall in addition handle 5GMM parameters and 5GMM state for this access, as described for this 5GMM cause value.

#76 (Not authorized for this CAG or authorized for CAG cells only).

This cause value received via non-3GPP access or from a cell belonging to an SNPN and the UE is operating in SNPN access operation mode is considered as an abnormal case and the behaviour of the UE is specified in subclause 5.5.1.3.7.

The UE shall set the 5GS update status to 5U3.ROAMING NOT ALLOWED, store the 5GS update status according to subclause 5.1.3.2.2, and reset the registration attempt counter.

If 5GMM cause #76 is received from:

1) a CAG cell, and if the UE receives a "CAG information list" in the CAG information list IE or the Extended CAG information list IE included in the REGISTRATION REJECT message, the UE shall:

i) replace the "CAG information list" stored in the UE with the received CAG information list IE or the Extended CAG information list IE when received in the HPLMN or EHPLMN;

ii) replace the serving VPLMN's entry of the "CAG information list" stored in the UE with the serving VPLMN's entry of the received CAG information list IE or the Extended CAG information list IE when the UE receives the CAG information list IE or the Extended CAG information list IE in a serving PLMN other than the HPLMN or EHPLMN; or

NOTE 10: When the UE receives the CAG information list IE or the Extended CAG information list IE in a serving PLMN other than the HPLMN or EHPLMN, entries of a PLMN other than the serving VPLMN, if any, in the received CAG information list IE or the Extended CAG information list IE are ignored.

iii) remove the serving VPLMN's entry of the "CAG information list" stored in the UE when the UE receives the CAG information list IE or the Extended CAG information list IE in a serving PLMN other than the HPLMN or EHPLMN and the CAG information list IE or the Extended CAG information list IE does not contain the serving VPLMN's entry.

Otherwise, the UE shall delete the CAG-ID(s) of the cell from the "allowed CAG list" for the current PLMN, if the CAG-ID(s) are authorized based on the "Allowed CAG list". In the case the "allowed CAG list" for the current PLMN only contains a range of CAG-IDs, how the UE deletes the CAG-ID(s) of the cell from the "allowed CAG list" for the current PLMN is up to UE implementation. In addition:

i) if the entry in the "CAG information list" for the current PLMN does not include an "indication that the UE is only allowed to access 5GS via CAG cells" or if the entry in the "CAG information list" for the current PLMN includes an "indication that the UE is only allowed to access 5GS via CAG cells" and one or more CAG-ID(s) are authorized based on the updated "allowed CAG list" for the current PLMN, then the UE shall enter the state 5GMM-REGISTERED.LIMITED-SERVICE and shall search for a suitable cell according to 3GPP TS 38.304 [28] or 3GPP TS 36.304 [25C] with the updated "CAG information list";

ii) if the entry in the "CAG information list" for the current PLMN includes an "indication that the UE is only allowed to access 5GS via CAG cells" and no CAG-ID is authorized based on the updated "allowed CAG list" for the current PLMN, then the UE shall enter the state 5GMM-REGISTERED.PLMN-SEARCH and shall apply the PLMN selection process defined in 3GPP TS 23.122 [5] with the updated "CAG information list"; or

iii) if the "CAG information list" does not include an entry for the current PLMN, then the UE shall enter the state 5GMM-REGISTERED.LIMITED-SERVICE and shall search for a suitable cell according to 3GPP TS 38.304 [28] or 3GPP TS 36.304 [25C] with the updated "CAG information list".

2) a non-CAG cell, and if the UE receives a "CAG information list" in the CAG information list IE or the Extended CAG information list IE included in the REGISTRATION REJECT message, the UE shall:

i) replace the "CAG information list" stored in the UE with the received CAG information list IE or the Extended CAG information list IE when received in the HPLMN or EHPLMN;

ii) replace the serving VPLMN's entry of the "CAG information list" stored in the UE with the serving VPLMN's entry of the received CAG information list IE or the Extended CAG information list IE when the UE receives the CAG information list IE or the Extended CAG information list IE in a serving PLMN other than the HPLMN or EHPLMN; or

NOTE 11: When the UE receives the CAG information list IE or the Extended CAG information list IE in a serving PLMN other than the HPLMN or EHPLMN, entries of a PLMN other than the serving VPLMN, if any, in the received CAG information list IE or the Extended CAG information list IE are ignored.

iii) remove the serving VPLMN's entry of the "CAG information list" stored in the UE when the UE receives the CAG information list IE or the Extended CAG information list IE in a serving PLMN other than the HPLMN or EHPLMN and the CAG information list IE or the Extended CAG information list IE does not contain the serving VPLMN's entry.

Otherwise, the UE shall store an "indication that the UE is only allowed to access 5GS via CAG cells" in the entry of the "CAG information list" for the current PLMN, if any. If the "CAG information list" stored in the UE does not include the current PLMN's entry, the UE shall add an entry for the current PLMN to the "CAG information list" and store an "indication that the UE is only allowed to access 5GS via CAG cells" in the entry of the "CAG information list" for the current PLMN. If the UE does not have a stored "CAG information list", the UE shall create a new "CAG information list" and add an entry with an "indication that the UE is only allowed to access 5GS via CAG cells" for the current PLMN.

In addition:

i) if one or more CAG-ID(s) are authorized based on the "allowed CAG list" for the current PLMN, then the UE shall enter the state 5GMM-REGISTERED.LIMITED-SERVICE and shall search for a suitable cell according to 3GPP TS 38.304 [28] with the updated CAG information; or

ii) if no CAG-ID is authorized based on the "allowed CAG list" for the current PLMN, then the UE shall enter the state 5GMM-REGISTERED.PLMN-SEARCH and shall apply the PLMN selection process defined in 3GPP TS 23.122 [5] with the updated "CAG information list".

If the message was received via 3GPP access and the UE is operating in single-registration mode, the UE shall in addition set the EPS update status to EU3 ROAMING NOT ALLOWED, reset the tracking area updating attempt counter and enter the state EMM-REGISTERED.

#77 (Wireline access area not allowed).

5GMM cause #77 is only applicable when received from a wireline access network by the 5G-RG or the W-AGF acting on behalf of the FN-CRG (or on behalf of the N5GC device). 5GMM cause #77 received from a 5G access network other than a wireline access network and 5GMM cause #77 received by the W-AGF acting on behalf of the FN-BRG are considered as abnormal cases and the behaviour of the UE is specified in subclause 5.5.1.3.7.

When received over wireline access network, the 5G-RG and the W-AGF acting on behalf of the FN-CRG (or on behalf of the N5GC device) shall set the 5GS update status to 5U3 ROAMING NOT ALLOWED (and shall store it according to subclause 5.1.3.2.2), shall delete 5G-GUTI, last visited registered TAI, TAI list and ngKSI, shall reset the registration attempt counter, shall enter the state 5GMM-DEREGISTERED and shall act as specified in subclause 5.3.23.

NOTE 12: The 5GMM sublayer states, the 5GMM parameters and the registration status are managed per access type independently, i.e. 3GPP access or non-3GPP access (see subclauses 4.7.2 and 5.1.3).

#78 (PLMN not allowed to operate at the present UE location).

This cause value received from a non-satellite NG-RAN cell is considered as an abnormal case and the behaviour of the UE is specified in subclause 5.5.1.3.7.

The UE shall set the 5GS update status to 5U3 ROAMING NOT ALLOWED (and shall store it according to subclause 5.1.3.2.2) and shall delete last visited registered TAI and TAI list. If the UE is not registering or has not registered to the same PLMN over both 3GPP access and non-3GPP access, the UE shall additionally delete the list of equivalent PLMNs, 5G-GUTI and ngKSI. Additionally, the UE shall reset the registration attempt counter. The UE shall store the PLMN identity and, if it is known, the current geographical location in the list of "PLMNs not allowed to operate at the present UE location" and shall start a corresponding timer instance (see subclause 4.23.2). The UE shall enter state 5GMM-DEREGISTERED.PLMN-SEARCH and perform a PLMN selection according to 3GPP TS 23.122 [5].

If the message was received via 3GPP access and the UE is operating in single-registration mode, the UE shall handle the EMM parameters EMM state, EPS update status, and tracking area updating attempt counter as specified in 3GPP TS 24.301 [15] for the case when the normal tracking area updating procedure is rejected with the EMM cause with the same value.

#79 (UAS services not allowed).

This cause value received when the UE did not include the service-level device ID set to the CAA-level UAV ID in the Service-level-AA container IE of REGISTRATION REQUEST message is considered as an abnormal case and the behaviour of the UE is specified in subclause 5.5.1.3.7.

The UE shall abort the registration procedure for mobility and periodic registration update procedure, set the 5GS update status to 5U2 NOT UPDATED and enter state 5GMM-REGISTERED.ATTEMPTING-REGISTRATION-UPDATE. Additionally, the UE shall reset the registration attempt counter. The UE may re-attempt the registration procedure to the current PLMN for services other than UAS services and shall not include the service-level device ID set to the CAA-level UAV ID in the Service-level-AA container IE of REGISTRATION REQUEST message unless the UE receives a CONFIGURATION UPDATE COMMAND message including the service-level-AA service status indication in the Service-level-AA container IE with the UAS field set to "UAS services enabled".

If the message was received via 3GPP access and the UE is operating in single-registration mode, the UE shall in addition set the EPS update status to EU2 NOT UPDATED, reset the tracking area updating attempt counter and enter the state EMM-REGISTERED.

#80 (Disaster roaming for the determined PLMN with disaster condition not allowed).

This cause value received via non-3GPP access or from a cell belonging to an SNPN and the UE is operating in SNPN access operation mode or when the UE did not indicate "disaster roaming mobility registration updating" in the 5GS registration type IE in the REGISTRATION REQUEST message is considered as an abnormal case and the behaviour of the UE is specified in subclause 5.5.1.3.7.

The UE shall abort the registration procedure for mobility and periodic registration update procedure, set the 5GS update status to 5U2 NOT UPDATED and enter state 5GMM-REGISTERED. PLMN-SEARCH. Additionally, the UE shall reset the registration attempt counter. The UE shall not attempt to register for disaster roaming on this PLMN for the UE determined PLMN with disaster condition for a period in the range of 12 to 24 hours. The UE shall not attempt to register for disaster roaming on this PLMN for a period in the range of 3 to 10 minutes. The UE shall perform PLMN selection as described in 3GPP TS 23.122 [6]. If the message has been successfully integrity checked by the NAS and the UE maintains the PLMN-specific attempt counter of the PLMN which sent the reject message for the UE determined PLMN with disaster condition, the UE shall set the PLMN-specific attempt counter of the PLMN which sent the reject message for the UE determined PLMN with disaster condition to the UE implementation-specific maximum value.

If the message was received via 3GPP access and the UE is operating in single-registration mode, the UE shall in addition set the EPS update status to EU2 NOT UPDATED, reset the tracking area updating attempt counter and enter the state EMM-REGISTERED.

#81 (Selected N3IWF is not compatible with the allowed NSSAI).

This cause value received when the UE does not access 5GCN over non-3GPP access using the N3IWF or has not indicated support for slice-based N3IWF selection in the REGISTRATION REQUEST message is considered as an abnormal case and the behaviour of the UE is specified in subclause 5.5.1.3.7.

The UE shall abort the registration procedure for mobility and periodic registration update procedure, set the 5GS update status to 5U2 NOT UPDATED and enter state 5GMM-DEREGISTERED.ATTEMPTING-REGISTRATION or 5GMM-DEREGISTERED.PLMN-SEARCH. Additionally, the UE shall reset the registration attempt counter. If the N3IWF identifier IE is included in the REGISTRATION REJECT message and the UE supports slice-based N3IWF selection, the UE may use the provided N3IWF identifier IE in N3IWF selection as specified in 3GPP TS 24.502 [18] prior to an immediate consecutive initial registration attempt to the network, otherwise the UE shall ignore the N3IWF identifier IE. Additionally, if the UE selects a new N3IWF and a new initial registration attempt is performed, the UE shall delete any 5G-GUTI, last visited registered TAI, TAI list and ngKSI.

#82 (Selected TNGF is not compatible with the allowed NSSAI).

This cause value received when the UE does not access 5GCN over non-3GPP access using the TNGF or has not indicated support for slice-based TNGF selection in the REGISTRATION REQUEST message is considered as an abnormal case and the behaviour of the UE is specified in subclause 5.5.1.3.7.

The UE shall abort the registration procedure for mobility and periodic registration update procedure, set the 5GS update status to 5U2 NOT UPDATED and enter state 5GMM-DEREGISTERED.ATTEMPTING-REGISTRATION or 5GMM-DEREGISTERED.PLMN-SEARCH. Additionally, the UE shall reset the registration attempt counter. If the TNAN information IE is included in the REGISTRATION REJECT message and the UE supports slice-based TNGF selection, the UE may use the provided TNAN information IE in TNAN selection as specified in 3GPP TS 24.502 [18] prior to an immediate consecutive registration attempt to the network, otherwise the UE shall ignore the TNAN information IE. Additionally, if the UE selects a new TNAN and a new initial registration attempt is performed, the UE shall delete any 5G-GUTI, last visited registered TAI, TAI list and ngKSI.

Other values are considered as abnormal cases. The behaviour of the UE in those cases is specified in subclause 5.5.1.3.7.

##### 5.5.1.3.6 Mobility and periodic registration update for initiating an emergency PDU session not accepted by the network

If the mobility and periodic registration update request for initiating an emergency PDU session cannot be accepted by the network, the UE shall perform the procedures as described in subclause 5.5.1.3.5. If the mobility and periodic registration update request for initiating an emergency PDU session fails due to receiving the AUTHENTICATION REJECT message, the UE shall perform the procedures as described in subclauses 5.4.1.2.2.11, 5.4.1.2.3.1, 5.4.1.2.3A.1 or 5.4.1.3.5. Then if the UE is in the same selected PLMN where the last mobility and periodic registration update request was attempted, the UE shall:

a) inform the upper layers of the failure of the procedure; or

NOTE 1: This can result in the upper layers requesting implementation specific mechanisms, e.g. procedures specified in 3GPP TS 24.229 [14] can result in the emergency call being attempted to another IP-CAN.

b) perform de-registration locally, if not de-registered already, and attempt initial registration for emergency services.

If the mobility and periodic registration update request for initiating an emergency PDU session fails due to abnormal case b) in subclause 5.5.1.3.7, the UE shall perform the actions as described in subclause 5.5.1.3.7 and inform the upper layers of the failure to access the network.

NOTE 2: This can result in the upper layers requesting implementation specific mechanisms, e.g. procedures specified in 3GPP TS 24.229 [14] can result in the emergency call being attempted to another IP-CAN.

If the mobility and periodic registration update request for initiating an emergency PDU session fails due to abnormal cases c), d), e) or g) in subclause 5.5.1.3.7, the UE shall perform the procedures as described in subclause 5.5.1.3.7. Then if the UE is in the same selected PLMN where the last mobility and periodic registration update request was attempted, the UE shall:

a) inform the upper layers of the failure of the procedure; or

NOTE 3: This can result in the upper layers requesting implementation specific mechanisms, e.g. procedures specified in 3GPP TS 24.229 [14] can result in the emergency call being attempted to another IP-CAN.

b) perform de-registration locally, if not de-registered already, and attempt initial registration for emergency services.

##### 5.5.1.3.6A Mobility and periodic registration update for an emergency services fallback not accepted by the network

If the mobility and periodic registration update request triggered upon receiving a request from the upper layers to perform an emergency services fallback:

- fails due to an abnormal case described in subclause 5.5.1.3.7, the UE shall perform the procedures as described in subclause 5.5.1.3.7;

- cannot be accepted by the network as described in subclause 5.5.1.3.5, the UE shall perform the procedures as described in subclause 5.5.1.3.5; or

- fails due to receiving the AUTHENTICATION REJECT message, the UE shall perform the procedures as described in subclauses 5.4.1.2.2.11, 5.4.1.2.3.1, 5.4.1.2.3A.1 or 5.4.1.3.5.

If the mobility and periodic registration update request triggered upon receiving a request from the upper layers to perform an emergency services fallback fails due to abnormal case b) in subclause 5.5.1.3.7, the UE shall inform the upper layers of the failure to access the network.

NOTE 1: This can result in the upper layers requesting implementation specific mechanisms, e.g. procedures specified in 3GPP TS 24.229 [14] can result in the emergency call being attempted to another IP-CAN.

If the mobility and periodic registration update request triggered upon receiving a request from the upper layers to perform an emergency services fallback fails due to abnormal cases c), d), e) or g), cannot be accepted or fails due to receiving the AUTHENTICATION REJECT message and the UE does not attempt to select an E-UTRA cell connected to EPC or 5GCN as described in subclause 5.5.1.3.5 and the UE is camped on NR or E-UTRA cell connected to 5GCN in the same PLMN where the last mobility and periodic registration update request was attempted, the UE shall inform the upper layers of the failure of the procedure.

NOTE 2: This can result in the upper layers requesting implementation specific mechanisms, e.g. procedures specified in 3GPP TS 24.229 [14] can result in the emergency call being attempted to another IP-CAN.

##### 5.5.1.3.7 Abnormal cases in the UE

The following abnormal cases can be identified:

a) Timer T3346 is running.

The UE shall not start the registration procedure for mobility and periodic registration update unless:

1) the UE is in 5GMM-CONNECTED mode;

2) the UE received a paging;

3) the UE receives a NOTIFICATION message over non-3GPP access when the UE is in 5GMM-CONNECTED mode over non-3GPP access and in 5GMM-IDLE mode over 3GPP access;

4) the UE is a UE configured for high priority access in selected PLMN or SNPN;

5) the UE has an emergency PDU session established or is establishing an emergency PDU session;

6) the UE receives a request from the upper layers to perform emergency services fallback;

7) the UE receives the CONFIGURATION UPDATE COMMAND message as specified in subclause 5.4.4.3;

8) the UE in NB-N1 mode is requested by the upper layer to transmit user data related to an exceptional event and:

- the UE is allowed to use exception data reporting (see the ExceptionDataReportingAllowed leaf of the NAS configuration MO in 3GPP TS 24.368 [17] or the USIM file EFNASCONFIG in 3GPP TS 31.102 [22]); and

- timer T3346 was not started when N1 NAS signalling connection was established with RRC establishment cause set to "mo-ExceptionData";

9) the MUSIM UE needs to request a new 5G-GUTI assignment as specified in subclause 5.5.1.3.2; or

10) the UE needs to report unavailability information due to discontinuous coverage.

The UE stays in the current serving cell and applies the normal cell reselection process.

NOTE 1: It is considered an abnormal case if the UE needs to initiate a registration procedure for mobility and periodic registration update while timer T3346 is running independent on whether timer T3346 was started due to an abnormal case or a non-successful case.

If the registration procedure for mobility and periodic registration update was initiated for an MO MMTEL voice call (i.e. access category 4), for an MO MMTEL video call (i.e. access category 5), for an MO IMS registration related signalling (i.e. access category 9) or for NAS signalling connection recovery during an ongoing MO MMTEL voice call (i.e. access category 4), or during an MO MMTEL video call (i.e. access category 5) or during an ongoing MO IMS registration related signalling (i.e. access category 9), then a notification that the procedure was not initiated due to network congestion shall be provided to upper layers.

b) The lower layers indicate that the access attempt is barred.

The UE shall not start the registration procedure for mobility and periodic registration update. The UE stays in the current serving cell and applies the normal cell reselection process. Receipt of the access barred indication shall not trigger the selection of a different core network type (EPC or 5GCN).

The registration procedure for mobility and periodic registration update is started, if still needed, when the lower layers indicate that the barring is alleviated for the access category with which the access attempt was associated.

ba) The lower layers indicate that:

1) access barring is applicable for all access categories except categories 0 and 2 and the access category with which the access attempt was associated is other than 0 and 2; or

2) access barring is applicable for all access categories except category 0 and the access category with which the access attempt was associated is other than 0.

If the REGISTRATION REQUEST message has not been sent, the UE shall proceed as specified for case b. If the REGISTRATION REQUEST message has been sent, the UE shall proceed as specified for case e and, additionally, the registration procedure for mobility and periodic registration update is started, if still needed, when the lower layers indicate that the barring is alleviated for the access category with which the access attempt was associated. For additional UE requirements for both cases see subclause 4.5.5.

c) T3510 timeout.

The UE shall abort the registration update procedure and the N1 NAS signalling connection, if any, shall be released locally.

If the UE has initiated the registration procedure in order to enable performing the service request procedure for emergency services fallback,the UE shall inform the upper layers of the failure of the emergency services fallback (see 3GP P TS 24.229 [14]). Otherwise, the UE shall proceed as described below.

d) REGISTRATION REJECT message, other 5GMM cause values than those treated in subclause 5.5.1.3.5, and cases of 5GMM cause values #11, #15, #22, #31, #36, #72, #73, #74, #75, #76, #77, #78, #79, #80, #81 and #82, if considered as abnormal cases according to subclause 5.5.1.3.5.

Upon reception of the 5GMM causes #95, #96, #97, #99 and #111 the UE should set the registration attempt counter to 5.

The UE shall proceed as described below.

e) Lower layer failure, release of the NAS signalling connection received from lower layers before the REGISTRATION ACCEPT or REGISTRATION REJECT message is received.

The UE shall abort the registration procedure and proceed as described below.

e1) Lower layer failure, the lower layers indicate that the RRC connection has been suspended without a cell change before the REGISTRATION ACCEPT or REGISTRATION REJECT message is received.

The registration procedure for mobility and periodic registration update shall be aborted and re-initiated immediately. The UE shall set the 5GS update status to 5U2 NOT UPDATED.

f) Change in the current TAI.

If the current TAI is changed before the registration procedure for mobility and periodic registration update is completed, the registration procedure for mobility and periodic registration update shall be aborted and re-initiated immediately. The UE shall set the 5GS update status to 5U2 NOT UPDATED.

g) Registration procedure for mobility and periodic registration update and de-registration procedure collision.

If the UE receives a DEREGISTRATION REQUEST message without 5GMM cause value #11, #12, #13, #15, #36, #62, #74, #75 or #78 before the registration procedure for mobility and periodic registration update has been completed, the registration procedure for mobility and periodic registration update shall be aborted and the de-registration procedure shall be progressed.

If the UE receives a DEREGISTRATION REQUEST message with 5GMM cause value #11, #12, #13, #15, #36, #62, #74, #75 or #78 before the registration procedure for mobility and periodic registration update has been completed, the registration procedure for mobility and periodic registration update shall be progressed and the de-registration procedure shall be aborted.

NOTE 2: The registration procedure for mobility and periodic registration update shall be aborted only if the DEREGISTRATION REQUEST message indicates in the access type that the access in which the registration procedure for mobility and periodic registration update was attempted shall be de-registered. Otherwise both the procedures shall be progressed.

h) Void

i) Transmission failure of REGISTRATION REQUEST message indication from the lower layers or the lower layers indicate that the RRC connection has been suspended with a cell change.

The registration procedure for mobility and periodic registration update shall be aborted and re-initiated immediately. The UE shall set the 5GS update status to 5U2 NOT UPDATED.

j) Transmission failure of REGISTRATION COMPLETE message indication with change in the current TAI.

If the current TAI is not in the TAI list, the registration procedure for mobility and periodic registration update shall be aborted and re-initiated immediately. The UE shall set the 5GS update status to 5U2 NOT UPDATED.

If the current TAI is still part of the TAI list, it is up to the UE implementation how to re-run the ongoing procedure.

k) Transmission failure of REGISTRATION COMPLETE message indication without change in the current TAI.

It is up to the UE implementation how to re-run the ongoing procedure.

l) UE-initiated de-registration required.

If the de-registration procedure is triggered due to removal of USIM or entry update in the "list of subscriber data", due to switch off or due to the last running Tsor-cm timer expired or was stopped:

The registration procedure for mobility and periodic registration update shall be aborted, and the UE initiated de-registration procedure shall be performed. The UE shall populate the 5GS mobile identity IE in the DEREGISTRATION REQUEST message with the same UE identity as used in the REGISTRATION REQUEST message for the aborted mobility and periodic registration update procedure;

Otherwise:

the UE initiated de-registration procedure shall be initiated after successful completion of the registration procedure for mobility and periodic registration update.

m) Timer T3447 is running

The UE shall not start any registration procedure for mobility and registration update with Uplink data status IE or Follow-on request indicator set to "Follow-on request pending" unless:

1) the UE received a paging;

2) the UE is a UE configured for high priority access in selected PLMN;

3) the UE has an emergency PDU session established or is establishing an emergency PDU session;

4) the UE receives a request from the upper layers to perform emergency services fallback; or

5) the MUSIM UE needs to request a new 5G-GUTI assignment as specified in subclause 5.5.1.3.2.

The UE stays in the current serving cell and applies the normal cell reselection process. The mobility and periodic registration update procedure is started, if still necessary, when timer T3447 expires or timer T3447 is stopped.

n) Timer T3448 is running

The UE in 5GMM-IDLE mode shall not start any mobility and periodic registration update procedure with Follow-on request indicator set to "Follow-on request pending" unless:

1) the UE is a UE configured for high priority access in selected PLMN;

2) the UE which is only using 5GS services with control plane CIoT 5GS optimization received a paging request;

3) the UE in NB-N1 mode is requested by the upper layer to transmit user data related to an exceptional event and the UE is allowed to use exception data reporting (see the ExceptionDataReportingAllowed leaf of the NAS configuration MO in 3GPP TS 24.368 [17] or the USIM file EFNASCONFIG in 3GPP TS 31.102 [22]);

4) the UE has an emergency PDU session established or is establishing an emergency PDU session; or

5) the UE receives a request from the upper layers to perform emergency services fallback.

The UE stays in the current serving cell and applies the normal cell reselection process. The mobility and periodic registration update procedure is started, if still necessary, when timer T3448 expires.

o) UE is not registered to the access other than the access the REGISTRATION ACCEPT message is received and the 5GS registration result value in the 5GS registration result IE value in the REGISTRATION ACCEPT message is set to "3GPP access and non-3GPP access".

The UE shall consider itself as being registered to only the access where the REGISTRATION ACCEPT message is received.

p) Access for localized services in current SNPN is no longer allowed.

If the mobility and periodic registration update is not for initiating an emergency PDU session, the registered SNPN is an SNPN selected for localized services in SNPN (see 3GPP TS 23.122 [5]) and:

- access for localized services in SNPN is disabled; or

- the validity information for the selected SNPN is no longer met;

the UE shall reset the registration attempt counter, stop T3510, abort the registration procedure for mobility and periodic registration update, locally release the NAS signalling connection, if any, and enter state 5GMM-REGISTERED.LIMITED-SERVICE or 5GMM-REGISTERED.PLMN-SEARCH in order to perform SNPN selection according to 3GPP TS 23.122 [5].

For the cases c, d and e the UE shall proceed as follows:

Timer T3510 shall be stopped if still running.

If the registration procedure is not for initiating an emergency PDU session, the registration attempt counter shall be incremented, unless it was already set to 5.

If the registration attempt counter is less than 5:

- if the TAI of the current serving cell is not included in the TAI list or the 5GS update status is different to 5U1 UPDATED or if the registration procedure was triggered due to cases c, g, n, v in subclause 5.5.1.3.2, the UE shall start timer T3511, shall set the 5GS update status to 5U2 NOT UPDATED and change to state 5GMM-REGISTERED.ATTEMPTING-REGISTRATION-UPDATE. When timer T3511 expires, the registration update procedure is triggered again.

- if the TAI of the current serving cell is included in the TAI list, the 5GS update status is equal to 5U1 UPDATED, and the UE is not performing the registration procedure after an inter-system change from S1 mode to N1 mode, the UE shall keep the 5GS update status to 5U1 UPDATED and enter state 5GMM-REGISTERED.NORMAL-SERVICE or 5GMM-REGISTERED.NON-ALLOWED-SERVICE (as described in subclause 5.3.5.2). The UE shall start timer T3511. If in addition the REGISTRATION REQUEST message did not include the MICO indication IE or the Extended DRX IE, and:

- the REGISTRATION REQUEST message indicated "periodic registration updating";

- the registration procedure was initiated to recover the NAS signalling connection due to "RRC Connection failure" from the lower layers;

- the registration procedure was initiated when the UE in 5GMM-CONNECTED mode over 3GPP access or 5GMM-CONNECTED mode with RRC inactive indication receives a fallback indication from lower layers; or

- the registration procedure was initiated by the UE in 5GMM-CONNECTED mode with RRC inactive indication entering a cell in the current registration area belonging to an equivalent PLMN of the registered PLMN and not belonging to the registered PLMN,

and none of the other reasons for initiating the registration updating procedure listed in subclause 5.5.1.3.2 was applicable, the timer T3511 may be stopped when the UE enters 5GMM-CONNECTED mode.

- if the TAI of the current serving cell is included in the TAI list, the 5GS update status is equal to 5U1 UPDATED and the UE is performing the registration procedure after an inter-system change from S1 mode to N1 mode, the UE shall change the 5GS update status to 5U2 NOT UPDATED and enter state 5GMM-REGISTERED.ATTEMPTING-REGISTRATION-UPDATE. The UE shall start timer T3511.

- If the procedure is performed via 3GPP access and the UE is operating in single-registration mode, the UE shall in addition handle the EPS update status as specified in 3GPP TS 24.301 [15] for the abnormal cases when a normal or periodic tracking area updating procedure fails and the tracking area attempt counter is less than 5 and the EPS update status is different from EU1 UPDATED.

If the registration attempt counter is equal to 5

- the UE shall start timer T3502 if the value of the timer as indicated by the network is not zero, shall set the 5GS update status to 5U2 NOT UPDATED.

- the UE shall delete the list of equivalent PLMNs (if any) or the list of equivalent SNPNs (if any) if the UE is not registering or has not registered to the same PLMN over both 3GPP access and non-3GPP access, and shall change to state 5GMM-REGISTERED.ATTEMPTING-REGISTRATION-UPDATE or optionally to 5GMM-REGISTERED.PLMN-SEARCH in order to perform a PLMN selection, SNPN selection or SNPN selection for onboarding services according to 3GPP TS 23.122 [5].

- if the value of T3502 as indicated by the network is zero, the UE shall perform the actions defined for the expiry of the timer T3502.

NOTE 3: For case e) if the lower layer failure is on a cell which was selected due to network slice-based cell reselection (see 3GPP TS 23.501 [8]), the UE can as an implementation option change the S-NSSAI(s) in the requested NSSAI to try and find a suitable NR cell.

- if the procedure is performed via 3GPP access and the UE is operating in single-registration mode:

- the UE shall in addition handle the EPS update status as specified in 3GPP TS 24.301 [15] for the abnormal cases when a normal or periodic tracking area updating procedure fails and the tracking area attempt counter is equal to 5; and

- if the UE does not change to state 5GMM-REGISTERED.PLMN-SEARCH, the UE shall attempt to select E-UTRAN radio access technology. The UE may disable the N1 mode capability as specified in subclause 4.9.

##### 5.5.1.3.8 Abnormal cases on the network side

The following abnormal cases can be identified:

a) Lower layer failure

If a lower layer failure occurs before the message REGISTRATION COMPLETE has been received from the UE and timer T3550 is running, the AMF shall abort the procedure, enter 5GMM-IDLE mode.

If a new 5G-GUTI was assigned to the UE in the REGISTRATION ACCEPT message, the AMF shall consider both, the old and new 5G-GUTIs as valid until the old 5G-GUTI can be considered as invalid by the AMF. If a new TAI list was provided in the REGISTRATION ACCEPT message, both the old and new TAI lists shall also be considered valid until the old TAI list can be considered invalid by the AMF. If the old 5G-GUTI was allocated by an AMF other than the current AMF, the current AMF does not need to retain the old 5G-GUTI.

Additionally, if the REGISTRATION ACCEPT message includes:

1) Negotiated PEIPS assistance information IE:

i) containing a new Paging subgroup ID and the UE is previously assigned a different Paging subgroup ID then, the AMF shall consider both, the old and new Paging subgroup IDs as valid until the old Paging subgroup ID can be considered as invalid by the AMF; or

NOTE 0: If the UE was not previously assigned a paging subgroup ID by the AMF, then AMF informs RAN about the new PEIPS assistance information, i.e., paging subgroup ID and it is up to RAN how to handle the old information at RAN and new information from AMF so that the paging is not missed.

ii) containing no Paging subgroup ID or no Negotiated PEIPS assistance information IE, then the AMF shall delete any old Paging subgroup ID stored in the 5GMM context of the UE.

2) Negotiated WUS assistance information IE:

i) containing a new UE paging probability information value and the UE is previously assigned a different UE paging probability information value then, the AMF shall consider both, the old and new UE paging probability information values as valid until the old UE paging probability information value can be considered as invalid by the AMF; or

ii) containing no UE paging probability information value or no Negotiated WUS assistance information IE, then the AMF shall delete any old UE paging probability information value stored in the 5GMM context of the UE.

During this period:

1) if the new 5G-GUTI is used by the UE in a subsequent message, then:

i) the AMF shall consider the old 5G-GUTI as invalid and, additionally, the old TAI list as invalid if a new TAI list was provided with the new 5G-GUTI in the REGISTRATION ACCEPT message;

ii) if the AMF assigns a new Paging subgroup ID to the UE in the REGISTRATION ACCEPT message, then, the AMF shall consider the new Paging subgroup ID as valid and the old Paging subgroup ID, if any, as invalid; and

iii) if the AMF assigns a new UE paging probability information value in the Negotiated WUS assistance information IE to the UE in the REGISTRATION ACCEPT message, then, the AMF shall consider the new UE paging probability information value as valid and the old UE paging probability information value, if any, as invalid.

2) if the old 5G-GUTI is used by the UE in a subsequent message, the AMF may use the identification procedure followed by a generic UE configuration update procedure. If the AMF in the REGISTRATION ACCEPT message:

i) assigns a new Paging subgroup ID to the UE, then, the AMF shall include the PEIPS assistance information; or

ii) does not assign a Paging subgroup ID to the UE then, the AMF shall not include the PEIPS assistance information;

and initiate the generic UE configuration update procedure; and

3) if the UE needs to be paged:

i) if in the REGISTRATION ACCEPT message a new Paging subgroup ID in the Negotiated PEIPS assistance information IE is assigned to the UE:

- that previously has no Paging subgroup ID assigned then, the AMF shall use the new Paging subgroup ID for paging the UE;

- that is same as the old Paging subgroup ID then, the AMF shall use the same Paging subgroup ID for paging the UE; or

- that is different than the old Paging subgroup ID then, the AMF may first use the old Paging subgroup ID followed by the new Paging subgroup ID for paging the UE.

ii) if in the REGISTRATION ACCEPT message a new UE paging probability information value in the Negotiated WUS assistance information IE is assigned to the UE:

- that previously has no UE paging probability information value assigned then, the AMF shall use the new UE paging probability information value for paging the UE;

- that is same as the old UE paging probability information value then, the AMF shall use the same UE paging probability information value for paging the UE; or

- that is different than the old UE paging probability information value then, the AMF may first use the old UE paging probability information value followed by the new UE paging probability information value for paging the UE.

iii) the AMF selects the 5G-GUTI and TAI list as follows:

- the AMF may first use the old 5G-S-TMSI from the old 5G-GUTI for paging within the area defined by the old TAI list for an implementation dependent number of paging attempts using the selected Paging subgroup ID or the selected UE paging probability information value in the WUS assistance information IE. If a new TAI list was provided in the REGISTRATION ACCEPT message, the new TAI list should also be used for paging. Upon response from the UE, the AMF may initiate the generic UE configuration update procedure. If the response is received from a tracking area within the old and new TAI list, the network shall initiate the generic UE configuration update procedure. If in the REGISTRATION ACCEPT message a new Paging subgroup ID was assigned to the UE that is different than the old Paging subgroup ID then the network shall initiate the generic UE configuration update procedure; and

- if no response is received to the paging attempts using the old 5G-S-TMSI from the old 5G-GUTI and the old Paging subgroup ID or the old UE paging probability information value in the WUS assistance information IE, the AMF may use the new 5G-S-TMSI from the new 5G-GUTI and the new Paging subgroup ID or the new UE paging probability information value in the WUS assistance information IE, if any, for paging, for an implementation dependent number of paging attempts. In this case, if a new TAI list was provided with the new 5G-GUTI in the REGISTRATION ACCEPT message, the new TAI list shall be used instead of the old TAI list.

b) Protocol error.

If the REGISTRATION REQUEST message has been received with a protocol error, the AMF shall return a REGISTRATION REJECT message with one of the following 5GMM cause values:

#96 invalid mandatory information;

#99 information element non-existent or not implemented;

#100 conditional IE error; or

#111 protocol error, unspecified.

c) T3550 time out.

On the first expiry of the timer, the AMF shall retransmit the REGISTRATION ACCEPT message and shall reset and restart timer T3550. The retransmission is performed four times, i.e. on the fifth expiry of timer T3550, the registration procedure for mobility and periodic registration update procedure is aborted.

During this period the AMF acts as described for case a) above.

d) REGISTRATION REQUEST with 5GS registration type IE set to "mobility registration updating" or "periodic registration updating" received after the REGISTRATION ACCEPT message has been sent and before the REGISTRATION COMPLETE message is received, if the REGISTRATION COMPLETE message is expected.

1) If one or more of the information elements in the REGISTRATION REQUEST message differ from the ones received within the previous REGISTRATION REQUEST message, the previously initiated registration procedure for mobility and periodic registration update shall be aborted if the REGISTRATION COMPLETE message has not been received and the new registration procedure for mobility and periodic registration update shall be progressed; or

2) if the information elements do not differ, then the REGISTRATION ACCEPT message shall be resent and timer T3550 shall be restarted. In that case, the retransmission counter related to timer T3550 is not incremented.

e) More than one REGISTRATION REQUEST message with 5GS registration type IE set to "mobility registration updating" or "periodic registration updating" received and neither REGISTRATION ACCEPT message nor REGISTRATION REJECT message has been sent.

1) If one or more of the information elements in the REGISTRATION REQUEST message differs from the ones received within the previous REGISTRATION REQUEST message, the previously initiated registration procedure for mobility and periodic registration update shall be aborted and the new registration procedure for mobility and periodic registration update shall be progressed; or

2) if the information elements do not differ, then the network shall continue with the previous registration procedure for mobility and periodic registration update and shall not treat any further this REGISTRATION REQUEST message.

f) Lower layers indication of non-delivered NAS PDU due to handover.

If the REGISTRATION ACCEPT message or REGISTRATION REJECT message could not be delivered due to an intra AMF handover and the target TA is included in the TAI list, then upon successful completion of the intra AMF handover the AMF shall retransmit the REGISTRATION ACCEPT message or REGISTRATION REJECT message. If a failure of the handover procedure is reported by the lower layer and the N1 NAS signalling connection exists, the AMF shall retransmit the REGISTRATION ACCEPT message or REGISTRATION REJECT message.

g) DEREGISTRATION REQUEST message received before REGISTRATION COMPLETE message is received, if the REGISTRATION COMPLETE message is expected.

If the De-registration type IE is set to "switch off":

The AMF shall abort the signalling for the registration procedure for mobility and periodic registration update towards the UE and shall progress the de-registration procedure as described in subclause 5.5.2.2.

NOTE 1: Internally in the AMF, before processing the de-registration request, the AMF can perform the necessary signalling procedures for the registration procedure for mobility and periodic registration update before progressing the de-registration procedure.

If the De-registration type IE is set to other type than "switch off":

The AMF shall proceed with registration procedure for mobility and periodic registration update and shall progress the de-registration procedure after successful completion of the registration procedure for mobility and periodic registration update.

h) If the REGISTRATION REQUEST message with 5GS registration type IE indicating "periodic registration updating" is received by the new AMF which does not have the 5GMM context data related to the subscription, the new AMF may send the REGISTRATION REJECT message with 5GMM cause #10 "implicitly de-registered".

i) Based on operator policy, if the mobility and periodic registration update request from a UE not supporting CAG is rejected due to CAG restrictions, the network shall reject the mobility and periodic registration update request with a 5GMM cause value other than the 5GMM cause #76 (Not authorized for this CAG or authorized for CAG cells only).

NOTE 2: 5GMM cause #7 (5GS services not allowed), 5GMM cause #11 (PLMN not allowed), 5GMM cause #27 (N1 mode not allowed), 5GMM cause #73 (Serving network not authorized) can be used depending on the subscription of the UE and whether the UE roams or not.