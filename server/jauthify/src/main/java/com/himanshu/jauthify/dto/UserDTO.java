package com.himanshu.jauthify.dto;

import com.himanshu.jauthify.entity.User;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserDTO {
    private String id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    private String organizationId;

    public static UserDTO toDto(User user, String organizationId) {
        UserDTO userDTO = new UserDTO();
        userDTO.setEmail(user.getEmail());
        userDTO.setId(user.getId().toString());
        userDTO.setName(user.getName());
        userDTO.setOrganizationId(organizationId);

        return userDTO;
    }
}
