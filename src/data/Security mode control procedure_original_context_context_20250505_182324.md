# Context for Security mode control procedure

# 3GPP TS 24.501

### 5.4.2 Security mode control procedure

#### 5.4.2.1 General

The purpose of the NAS security mode control procedure is to take a 5G NAS security context into use, and initialise and start NAS signalling security between the UE and the AMF with the corresponding 5G NAS keys and 5G NAS security algorithms.

Furthermore, the network may also initiate the security mode control procedure in the following cases:

a)- in order to change the 5G NAS security algorithms for a current 5G NAS security context already in use;

b) in order to change the value of uplink NAS COUNT used in the latest SECURITY MODE COMPLETE message as described in 3GPP TS 33.501 [24], subclause 6.9.4.4; and

c) in order to provide the Selected EPS NAS security algorithms to the UE.

For restrictions concerning the concurrent running of a security mode control procedure with other security related procedures in the AS or inside the core network see 3GPP TS 33.501 [24], subclause 6.9.5.

If the security mode control procedure is initiated after successful 5G AKA based primary authentication and key agreement procedure and the security mode control procedure intends to bring into use the partial native 5G NAS security context created by the 5G AKA based primary authentication and key agreement procedure and the UE accepts received security mode command (see subclause 5.4.2.3), the ME shall:

a) delete the valid KAUSF and the valid KSEAF, if any; and

b) consider the new KAUSF to be the valid KAUSF, and the new KSEAF to be the valid KSEAF, reset the SOR counter and the UE parameter update counter to zero, and store the valid KAUSF, the valid KSEAF, the SOR counter and the UE parameter update counter as specified in annex C and use the valid KAUSF in the verification of SOR transparent container and UE parameters update transparent container, if any are received.

NOTE: The AMF does not perform a security mode control procedure when the 5G AKA based primary authentication procedure successfully authenticates a 5G ProSe layer-3 remote UE accessing the network via a 5G ProSe layer-3 UE-to-network relay UE served by the AMF.

#### 5.4.2.2 NAS security mode control initiation by the network

The AMF initiates the NAS security mode control procedure by sending a SECURITY MODE COMMAND message to the UE and starting timer T3560 (see example in figure 5.4.2.2).

The AMF shall reset the downlink NAS COUNT counter and use it to integrity protect the initial SECURITY MODE COMMAND message if the security mode control procedure is initiated:

a) to take into use the security context created after a successful execution of the 5G AKA based primary authentication and key agreement procedure or the EAP based primary authentication and key agreement procedure; or

b) upon receipt of REGISTRATION REQUEST message, if the AMF needs to create a mapped 5G NAS security context (i.e. the type of security context flag is set to "mapped security context" in the ngKSI IE included in the SECURITY MODE COMMAND message).

The AMF shall send the SECURITY MODE COMMAND message unciphered, but shall integrity protect the message with the 5G NAS integrity key based on KAMF or mapped K'AMF indicated by the ngKSI included in the message. The AMF shall set the security header type of the message to "integrity protected with new 5G NAS security context".

The AMF shall create a locally generated KAMF and send the SECURITY MODE COMMAND message including an ngKSI value in the ngKSI IE set to "000" and 5G-IA0 and 5G-EA0 as the selected NAS security algorithms only when the security mode control procedure is initiated:

a) during an initial registration procedure for emergency services if no valid 5G NAS security context is available;

b) during a registration procedure for mobility and periodic registration update for a UE that has an emergency PDU session if no valid 5G NAS security context is available;

c) during a service request procedure for a UE that has an emergency PDU session if no valid 5G NAS security context is available; or

d) after a failed primary authentication and key agreement procedure for a UE that has an emergency PDU session or is establishing an emergency PDU session, if continued usage of a valid 5G NAS security context is not possible.

When the AMF sends the SECURITY MODE COMMAND message including an ngKSI value in the ngKSI IE set to "000" and 5G-IA0 and 5G-EA0 as the selected NAS security algorithms, if:

a) the AMF supports N26 interface;

b) the UE set the S1 mode bit to "S1 mode supported" in the 5GMM capability IE of the REGISTRATION REQUEST message; and

c) the security mode control procedure is initiated during an initial registration procedure for emergency services, during a registration procedure for mobility and periodic registration update for a UE that has an emergency PDU session, or during a service request procedure for a UE that has an emergency PDU session,

the SECURITY MODE COMMAND message shall also include the Selected EPS NAS security algorithms IE. The selected EPS NAS security algorithms shall be set to EIA0 and EEA0.

The UE shall process a SECURITY MODE COMMAND message including an ngKSI value in the ngKSI IE set to "000" and 5G-IA0 and 5G-EA0 as the selected NAS security algorithms and, if accepted, create a locally generated KAMF when the security mode control procedure is initiated:

a) during an initial registration procedure for emergency services;

b) during a registration procedure for mobility and periodic registration update for a UE that has an emergency PDU session;

c) during a service request procedure for a UE that has an emergency PDU session; or

d) after a primary authentication and key agreement procedure for a UE that has an emergency PDU session or is establishing an emergency PDU session.

NOTE 1: The process for creation of the locally generated KAMF by the AMF and the UE is implementation dependent. The KAMF is specified in 3GPP TS 33.501 [24].

Upon receipt of a REGISTRATION REQUEST message, if the AMF does not have the valid current 5G NAS security context indicated by the UE, the AMF shall either:

a) indicate the use of the new mapped 5G NAS security context to the UE by setting the type of security context flag in the ngKSI IE to "mapped security context" and the KSI value related to the security context of the source system; or

b) set the ngKSI value to "000" in the ngKSI IE if the AMF sets 5G-IA0 and 5G-EA0 as the selected NAS security algorithms for a UE that has an emergency PDU session.

Upon receipt of a REGISTRATION REQUEST message, if the AMF has the valid current 5G NAS security context indicated by the UE, the AMF supports N26 interface and the UE set the S1 mode bit to "S1 mode supported" in the 5GMM capability IE of the REGISTRATION REQUEST message and the UE is not registered for disaster roaming services, the AMF shall check whether the selected EPS NAS security algorithms was successfully provided to the UE. If not, the AMF shall initiate the NAS security mode control procedure by sending a SECURITY MODE COMMAND message with the Selected EPS NAS security algorithms IE to the UE.

While having a current mapped 5G NAS security context with the UE, if the AMF needs to take the native 5G NAS security context into use, the AMF shall include the ngKSI that indicates the native 5G NAS security context in the SECURITY MODE COMMAND message.

The AMF shall include the replayed security capabilities of the UE (including the security capabilities with regard to NAS, RRC and UP (user plane) ciphering as well as NAS and RRC integrity, and other possible target network security capabilities, i.e. E-UTRAN if the UE included them in the message to network), the selected 5GS ciphering and integrity algorithms and the ngKSI.

If a UE is already registered over one access to a PLMN and the AMF decides to skip primary authentication and key agreement procedure when the UE attempts to register over the other access to the same PLMN, the AMF shall take into use the UE's current 5G NAS security context over the other access that the UE is registering. In this case, SECURITY MODE COMMAND message is not sent to the UE.

If the UE is registered to the same AMF and the same PLMN over both 3GPP access and non-3GPP access, and the UE is in 5GMM-CONNECTED mode over both the 3GPP and non-3GPP accesses, then at any time the primary authentication and key agreement procedure has successfully completed over:

a) the 3GPP access, the AMF includes the ngKSI in the SECURITY MODE COMMAND message over the 3GPP access. When the AMF sends the SECURITY MODE COMMAND message to UE over the non-3GPP access to take into use the new 5G NAS security context, the AMF shall include the same ngKSI in the SECURITY MODE COMMAND message to identify the new 5G NAS security context; or

b) the non-3GPP access, the AMF includes the ngKSI in the SECURITY MODE COMMAND message over the non-3GPP access. When the AMF sends the SECURITY MODE COMMAND message to UE over the 3GPP access to take into use the new 5G NAS security context, the AMF shall include the same ngKSI in the SECURITY MODE COMMAND message to identify the new 5G NAS security context.

The AMF may initiate a SECURITY MODE COMMAND in order to change the 5G security algorithms for a current 5G NAS security context already in use. The AMF re-derives the 5G NAS keys from KAMF with the new 5G algorithm identities as input and provides the new 5GS algorithm identities within the SECURITY MODE COMMAND message. The AMF shall set the security header type of the message to "integrity protected with new 5G NAS security context".

If, during an ongoing registration procedure, the AMF is initiating a SECURITY MODE COMMAND (i.e. after receiving the REGISTRATION REQUEST message, but before sending a response to that message) and:

a) the REGISTRATION REQUEST message does not successfully pass the integrity check at the AMF; or

b) the AMF can not decipher the value part of the NAS message container IE in the REGISTRATION REQUEST message;

the AMF shall include the Additional 5G security information IE with the RINMR bit set to "Retransmission of the initial NAS message requested" in the SECURITY MODE COMMAND message requesting the UE to send the entire REGISTRATION REQUEST message in the SECURITY MODE COMPLETE message as described in 3GPP TS 33.501 [24].

If, during an ongoing deregistration procedure, the AMF is initiating a SECURITY MODE COMMAND (i.e. after receiving the DEREGISTRATION REQUEST message, but before sending a response to that message) and:

a) the DEREGISTRATION REQUEST message does not successfully pass the integrity check at the AMF; or

b) the AMF can not decipher the value part of the NAS message container IE in the DEREGISTRATION REQUEST message;

the AMF shall include the Additional 5G security information IE with the RINMR bit set to "Retransmission of the initial NAS message requested" in the SECURITY MODE COMMAND message requesting the UE to send the entire DEREGISTRATION REQUEST message in the SECURITY MODE COMPLETE message as described in 3GPP TS 33.501 [24].

NOTE 2: The AMF uses the UE security capability which was provided by the UE.

If, during an ongoing service request procedure for a UE with an emergency PDU session, the AMF is initiating a SECURITY MODE COMMAND (i.e. after receiving the SERVICE REQUEST message or the CONTROL PLANE SERVICE REQUEST message, but before sending a response to that message) and the SERVICE REQUEST message or the CONTROL PLANE SERVICE REQUEST message does not successfully pass the integrity check at the AMF, the AMF shall include the Additional 5G security information IE with the RINMR bit set to "Retransmission of the initial NAS message requested" in the SECURITY MODE COMMAND message requesting the UE to send the entire:

a) SERVICE REQUEST message; or

b) CONTROL PLANE SERVICE REQUEST message excluding non-cleartext IEs, except the Uplink data status IE if needed (see subclause 5.4.2.3);

in the SECURITY MODE COMPLETE message as described in 3GPP TS 33.501 [24].

Additionally, the AMF may request the UE to include its IMEISV in the SECURITY MODE COMPLETE message.

If the AMF supports N26 interface and the UE set the S1 mode bit to "S1 mode supported" in the 5GMM capability IE of the REGISTRATION REQUEST message and the AMF needs to provide the selected EPS NAS security algorithms to the UE, the AMF shall select ciphering and integrity algorithms to be used in the EPS and indicate them to the UE via the Selected EPS NAS security algorithms IE in the SECURITY MODE COMMAND message.

NOTE 3: The AS and NAS security capabilities are the same, i.e. if the UE supports one algorithm for NAS, the same algorithm is also supported for AS.

If the AMF performs horizontal key derivation e.g. during the mobility and periodic registration update or when the UE is already registered in the PLMN with another access type as described in 3GPP TS 33.501 [24], the AMF shall include horizontal derivation parameter in the SECURITY MODE COMMAND message.

If the security mode control procedure is initiated after successful EAP based primary authentication and key agreement procedure and the security mode control procedure intends to bring into use the partial native 5G NAS security context created by the EAP based primary authentication and key agreement procedure, the AMF shall set the EAP message IE of the SECURITY MODE COMMAND message to an EAP-success message to be sent to the UE. If the SECURITY MODE COMMAND message is provided to a 5G-RG that is acting on behalf of an AUN3 device and the EAP message IE is set to an EAP-success message, the AMF shall include the AUN3 device security key IE in the SECURITY MODE COMMAND message with its value set to:

a) the Master session key, if the AUN3 device does not support 5G key hierarchy; or

b) the KWAGF key, if the AUN3 device supports 5G key hierarchy.

NOTE 4: The network is aware from the AUN3 device subscription data in UDM whether the AUN3 device supports 5G key hierarchy or not as specified in subclause 7B.7 of 3GPP TS 33.501 [24].

Figure 5.4.2.2: Security mode control procedure

#### 5.4.2.3 NAS security mode command accepted by the UE

Upon receipt of the SECURITY MODE COMMAND message, the UE shall check whether the security mode command can be accepted or not. This is done by performing the integrity check of the message, and by checking that the received Replayed UE security capabilities IE has not been altered compared to the latest values that the UE sent to the network.

When the SECURITY MODE COMMAND message includes an EAP-success message the UE handles the EAP-success message and the ABBA as described in subclause 5.4.1.2.2.8, 5.4.1.2.3.1, 5.4.1.2.3A.1, 5.4.1.2.3B.1 and 5.4.1.2.3C.1.

If:

a) the UE is registered for emergency services, performing initial registration for emergency services, establishing an emergency PDU session or has an emergency PDU session established;

b) the W-AGF acts on behalf of the FN-RG;

c) the W-AGF acts on behalf of the N5GC device; or

d) the 5G-RG acts on behalf of the AUN3 device,

and the SECURITY MODE COMMAND message is received with ngKSI value "000" and 5G-IA0 and 5G-EA0 as selected 5G NAS security algorithms, the UE shall locally derive and take in use 5G NAS security context. The UE shall delete existing current 5G NAS security context.

The UE shall accept a SECURITY MODE COMMAND message indicating the "null integrity protection algorithm" 5G-IA0 as the selected 5G NAS integrity algorithm only if the message is received when

a) the UE is registered for emergency services, performing initial registration for emergency services, establishing an emergency PDU session or has an emergency PDU session established;

b) the W-AGF acts on behalf of the FN-RG;

c) the W-AGF acts on behalf of the N5GC device; or

d) the 5G-RG acts on behalf of the AUN3 device.

If the type of security context flag included in the SECURITY MODE COMMAND message is set to "native security context" and if the ngKSI matches a valid non-current native 5G NAS security context held in the UE while the UE has a mapped 5G NAS security context as the current 5G NAS security context, the UE shall take the non-current native 5G NAS security context into use which then becomes the current native 5G NAS security context and delete the mapped 5G NAS security context.

The UE shall ignore the Replayed S1 UE security capabilities IE if this IE is included in the SECURITY MODE COMMAND message.

If the SECURITY MODE COMMAND message can be accepted, the UE shall take the 5G NAS security context indicated in the message into use. The UE shall in addition reset the uplink NAS COUNT counter if:

a) the SECURITY MODE COMMAND message is received in order to take a 5G NAS security context into use created after a successful execution of the 5G AKA based primary authentication and key agreement procedure or the EAP based primary authentication and key agreement procedure; or

b) the SECURITY MODE COMMAND message received includes the type of security context flag set to "mapped security context" in the NAS key set identifier IE the ngKSI does not match the current 5G NAS security context, if it is a mapped 5G NAS security context.

If the SECURITY MODE COMMAND message can be accepted and a new 5G NAS security context is taken into use and SECURITY MODE COMMAND message does not indicate the "null integrity protection algorithm" 5G-IA0 as the selected NAS integrity algorithm, the UE shall:

- if the SECURITY MODE COMMAND message has been successfully integrity checked using an estimated downlink NAS COUNT equal to 0, then the UE shall set the downlink NAS COUNT of this new 5G NAS security context to 0;

- otherwise the UE shall set the downlink NAS COUNT of this new 5G NAS security context to the downlink NAS COUNT that has been used for the successful integrity checking of the SECURITY MODE COMMAND message.

If the SECURITY MODE COMMAND message includes the horizontal derivation parameter indicating "KAMF derivation is required", the UE shall derive a new K'AMF, as specified in 3GPP TS 33.501 [24] for KAMF to K'AMF derivation in mobility, and set both uplink and downlink NAS COUNTs to zero. When the new 5G NAS security context is taken into use for current access and the UE is registered with the same PLMN over the 3GPP access and the non-3GPP access:

a) the UE is in 5GMM-IDLE mode over the non-current access, the AMF and the UE shall activate the new 5G NAS security context over the non-current access as described in 3GPP TS 33.501 [24]. The AMF and the UE shall set the downlink NAS COUNT and uplink NAS COUNT to zero for the non-current access; or

b) the UE is in 5GMM-CONNECTED mode over the non-current access, the AMF shall send the SECURITY MODE COMMAND message over the non-current access to activate the new 5G NAS security context that was activated over the current access as described in 3GPP TS 33.501 [24]. The AMF shall include the same ngKSI in the SECURITY MODE COMMAND message to identify the new 5G NAS security context.

NOTE 1: If the UE was in 5GMM-CONNECTED mode over the non-current access when the new 5G NAS security context was taken into use for the current access and the UE enters 5GMM-IDLE mode over the non-current access before receiving a SECURITY MODE COMMAND message over the non-current access, the UE conforms to bullet a).

NOTE 2: If the UE was in 5GMM-CONNECTED mode over the non-current access when the new 5G NAS security context was taken into use and the N1 NAS signalling connection is lost over the non-current access before sending a SECURITY MODE COMMAND message over the non-current access, the AMF conforms to bullet a).

If the SECURITY MODE COMMAND message includes the horizontal derivation parameter indicating "KAMF derivation is not required" or the Additional 5G security information IE is not included in the message, the UE is registered with the same PLMN over the 3GPP access and non-3GPP access, then after the completion of a security mode control procedure over the current access:

a) the UE is in 5GMM-IDLE mode over the non-current access, the AMF and the UE shall activate the new 5G NAS security context for the non-current access. If a primary authentication and key agreement procedure was completed before the security mode control procedure, the AMF and the UE shall set the downlink NAS COUNT and uplink NAS COUNT to zero for the non-current access, otherwise the downlink NAS COUNT and uplink NAS COUNT for the non-3GPP access are not changed; or

b) the UE is in 5GMM-CONNECTED mode over the non-current access, the AMF shall send the SECURITY MODE COMMAND message over the non-current access to activate the new 5G NAS security context that was activated over the current access as described in 3GPP TS 33.501 [24]. The AMF shall include the same ngKSI in the SECURITY MODE COMMAND message to identify the new 5G NAS security context.

NOTE 3: If the UE was in 5GMM-CONNECTED mode over the non-current access when the new 5G NAS security context was taken into use for the current access and the UE enters 5GMM-IDLE mode over the non-current access before receiving a SECURITY MODE COMMAND message over the non-current access, the UE conforms to bullet a).

NOTE 4: If the UE was in 5GMM-CONNECTED mode over the non-current access when the new 5G NAS security context was taken into use and the N1 NAS signalling connection is lost over the non-current access before sending a SECURITY MODE COMMAND message over the non-current access, the AMF conforms to bullet a).

If the SECURITY MODE COMMAND message can be accepted, the UE shall send a SECURITY MODE COMPLETE message integrity protected with the selected 5GS integrity algorithm and the 5G NAS integrity key based on the KAMF or mapped K'AMF if the type of security context flag is set to "mapped security context" indicated by the ngKSI. When the SECURITY MODE COMMAND message includes the type of security context flag set to "mapped security context" in the NAS key set identifier IE, then the UE shall check whether the SECURITY MODE COMMAND message indicates the ngKSI of the current 5GS security context, if it is a mapped 5G NAS security context, in order not to re-generate the K'AMF.

Furthermore, if the SECURITY MODE COMMAND message can be accepted, the UE shall cipher the SECURITY MODE COMPLETE message with the selected 5GS ciphering algorithm and the 5GS NAS ciphering key based on the KAMF or mapped K'AMF indicated by the ngKSI. The UE shall set the security header type of the message to "integrity protected and ciphered with new 5G NAS security context".

From this time onward the UE shall cipher and integrity protect all NAS signalling messages with the selected 5GS integrity and ciphering algorithms.

If the AMF indicated in the SECURITY MODE COMMAND message that the IMEISV is requested and:

a) if the UE:

1) supports at least one 3GPP access technology, the UE shall include its IMEISV in the IMEISV IE of the SECURITY MODE COMPLETE message; or

2) does not support any 3GPP access technology (i.e. satellite NG-RAN, NG-RAN, satellite E-UTRAN, E-UTRAN, UTRAN or GERAN) and supports NAS over untrusted or trusted non-3GPP access, the UE shall include its EUI-64 in the non-IMEISV PEI IE of the SECURITY MODE COMPLETE message; or

b) if:

1) the 5G-RG contains neither an IMEISV nor an IMEI or when the 5G-RG acts on behalf of the AUN3 device; or

2) when the W-AGF acts on behalf of the FN-RG (or on behalf of the N5GC device),

the 5G-RG or the W-AGF acting on behalf of the FN-RG (or on behalf of the N5GC device) shall include the MAC address and the MAC address usage restriction indication determined as specified in subclause 5.3.2 in the non-IMEISV PEI IE in the SECURITY MODE COMPLETE message.

If during an ongoing registration procedure, deregistration procedure, or service request procedure, the UE receives a SECURITY MODE COMMAND message which includes the Additional 5G security information IE with the RINMR bit set to "Retransmission of the initial NAS message requested", the UE shall include the entire unciphered REGISTRATION REQUEST message, DEREGISTRATION REQUEST message, SERVICE REQUEST message or CONTROL PLANE SERVICE REQUEST message, which the UE had previously included in the NAS message container IE of the initial NAS message (i.e. REGISTRATION REQUEST message, DEREGISTRATION REQUEST MESSAGE, SERVICE REQUEST message or CONTROL PLANE SERVICE REQUEST message, respectively), in the NAS message container IE of the SECURITY MODE COMPLETE message. The retransmitted CONTROL PLANE SERVICE REQUEST message:

a) shall not include any non-cleartext IE, except the Uplink data status IE; and

b) may include the Uplink data status IE.

If, prior to receiving the SECURITY MODE COMMAND message, the UE without a valid 5G NAS security context had sent a REGISTRATION REQUEST message the UE shall include the entire REGISTRATION REQUEST message in the NAS message container IE of the SECURITY MODE COMPLETE message as described in subclause 4.4.6.

If the UE operating in the single-registration mode receives the Selected EPS NAS security algorithms IE, the UE shall use the IE according to 3GPP TS 33.501 [24].

For a UE operating in single-registration mode in a network supporting N26 interface after an inter-system change from S1 mode to N1 mode in 5GMM-CONNECTED mode, the UE shall set the value of the Selected EPS NAS security algorithms IE in the 5G NAS security context to the NAS security algorithms that were received from the source MME when the UE was in S1 mode.

#### 5.4.2.4 NAS security mode control completion by the network

The AMF shall, upon receipt of the SECURITY MODE COMPLETE message, stop timer T3560. From this time onward the AMF shall integrity protect and encipher all signalling messages with the selected 5GS integrity and ciphering algorithms.

If the SECURITY MODE COMPLETE message contains a NAS message container IE with a REGISTRATION REQUEST message, the AMF shall complete the ongoing registration procedure by considering the REGISTRATION REQUEST message contained in the NAS message container IE as the message that triggered the procedure.

If the SECURITY MODE COMPLETE message contains a NAS message container IE with a DEREGISTRATION REQUEST message, the AMF shall complete the ongoing deregistration procedure by considering the DEREGISTRATION REQUEST message contained in the NAS message container IE as the message that triggered the procedure.

If the SECURITY MODE COMPLETE message contains a NAS message container IE with a REGISTRATION REQUEST message, the 5GMM capability IE included in the REGISTRATION REQUEST message indicates "S1 mode supported" and the AMF supports N26 interface, the AMF shall initiate another NAS security mode control procedure in order to provide the selected EPS NAS security algorithms to the UE as described in subclause 5.4.2.2. This second NAS security mode control procedure should be initiated as part of 5GMM common procedures of the ongoing registration procedure.

If the SECURITY MODE COMPLETE message contains a NAS message container IE with a SERVICE REQUEST message, the AMF shall complete the ongoing service request procedure by considering the SERVICE REQUEST message contained in the NAS message container IE as the message that triggered the procedure.

If the SECURITY MODE COMPLETE message contains a NAS message container IE with a CONTROL PLANE SERVICE REQUEST message, the AMF shall complete the ongoing service request procedure by considering the CONTROL PLANE SERVICE REQUEST message contained in the NAS message container IE as the message that triggered the procedure.

#### 5.4.2.5 NAS security mode command not accepted by the UE

If the security mode command cannot be accepted, the UE shall send a SECURITY MODE REJECT message. The SECURITY MODE REJECT message contains a 5GMM cause that typically indicates one of the following cause values:

#23 UE security capabilities mismatch.

#24 security mode rejected, unspecified.

If the UE detects that the received Replayed UE security capabilities IE has been altered compared to the latest values that the UE sent to the network, the UE shall set the cause value to #23 "UE security capabilities mismatch".

Upon receipt of the SECURITY MODE REJECT message, the AMF shall stop timer T3560. The AMF shall also abort the ongoing procedure that triggered the initiation of the NAS security mode control procedure.

Both the UE and the AMF shall apply the 5G NAS security context in use before the initiation of the security mode control procedure, if any, to protect the SECURITY MODE REJECT message and any other subsequent messages according to the rules in subclause 4.4.4 and 4.4.5.

#### 5.4.2.6 Abnormal cases in the UE

The following abnormal cases can be identified:

a) Transmission failure of SECURITY MODE COMPLETE message or SECURITY MODE REJECT message indication from lower layers (if the security mode control procedure is triggered by a registration procedure).

The UE shall abort the security mode control procedure and re-initiate the registration procedure.

b) Transmission failure of SECURITY MODE COMPLETE message or SECURITY MODE REJECT message indication with change in the current TAI (if the security mode control procedure is triggered by a service request procedure).

If the current TAI is not in the TAI list, the security mode control procedure shall be aborted and a registration procedure shall be initiated.

If the current TAI is still part of the TAI list, the security mode control procedure shall be aborted and it is up to the UE implementation how to re-run the ongoing procedure that triggered the security mode control procedure.

c) Transmission failure of SECURITY MODE COMPLETE message or SECURITY MODE REJECT message indication without change in the current TAI (if the security mode control procedure is triggered by a service request procedure).

The security mode control procedure shall be aborted and it is up to the UE implementation how to re-run the ongoing procedure that triggered the security mode control procedure.

d) NAS security mode command not accepted by the UE as specified in subclause 5.4.2.5 and there is an ongoing:

1) service request procedure for emergency services fallback the UE shall abort the service request procedure, stop timer T3517, locally release the N1 NAS signalling connection and locally release any resources allocated for the service request procedure and enter state 5GMM-REGISTERED; or

2) registration procedure for mobility and periodic registration update triggered upon a request from the upper layers to perform an emergency services fallback procedure the UE shall abort the registration procedure for mobility and periodic registration update, stop timer T3510, locally release the N1 NAS signalling connection and locally release any resources allocated for the registration procedure for mobility and periodic registration update and enter the state 5GMM-REGISTERED; and

the UE shall attempt to select an E-UTRA cell connected to EPC or 5GCN according to the domain priority and selection rules specified in 3GPP TS 23.167 [6]. If the UE finds a suitable E-UTRA cell, it proceeds with the appropriate EMM or 5GMM procedures. If the UE operating in single-registration mode has changed to S1 mode, it shall disable the N1 mode capability for 3GPP access.

#### 5.4.2.7 Abnormal cases on the network side

The following abnormal cases can be identified:

a) Lower layer failure before the SECURITY MODE COMPLETE or SECURITY MODE REJECT message is received.

The network shall abort the security mode control procedure.

b) Expiry of timer T3560.

The network shall, on the first expiry of the timer T3560, retransmit the SECURITY MODE COMMAND message and shall reset and start timer T3560. This retransmission is repeated four times, i.e. on the fifth expiry of timer T3560, the procedure shall be aborted.

c) Collision between security mode control procedure and registration, service request or de-registration procedure not indicating switch off.

The network shall abort the security mode control procedure and proceed with the UE initiated procedure.

d) Collision between security mode control procedure and other 5GMM procedures than in item c.

The network shall progress both procedures.

e) Lower layers indication of non-delivered NAS PDU due to handover:

If the SECURITY MODE COMMAND message could not be delivered due to an intra AMF handover and the target TA is included in the TAI list, then upon successful completion of the intra AMF handover the AMF shall retransmit the SECURITY MODE COMMAND message. If a failure of the handover procedure is reported by the lower layer and the N1 signalling connection exists, the AMF shall retransmit the SECURITY MODE COMMAND message.