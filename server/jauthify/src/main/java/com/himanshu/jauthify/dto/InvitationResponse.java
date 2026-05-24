package com.himanshu.jauthify.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class InvitationResponse {
    private String id;
    private String organizationName;
    private String inviterName;
}
