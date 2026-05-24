package com.himanshu.jauthify.dto;

import com.himanshu.jauthify.entity.Organization;

import lombok.Data;

@Data
public class OrganizationDTO {
    private String id;
    private String name;
    private String slug;

    public static OrganizationDTO toDTO(Organization organization) {
        OrganizationDTO organizationDTO = new OrganizationDTO();

        organizationDTO.setId(organization.getId().toString());
        organizationDTO.setSlug(organization.getSlug());
        organizationDTO.setName(organization.getName());

        return organizationDTO;
    }
}
