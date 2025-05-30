package com.jotsamikael.applycam.staff;

import lombok.Builder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

/*
 * This class is used to map a Staff Object to a StaffResponse object and vice-versa
 * */
@Service
public class StaffMapper {

    public StaffResponse toStaffResponse(Staff staff){
        return StaffResponse.builder()
                .firstname(staff.getFirstname())
                .lastname(staff.getLastname())
                .dateOfBirth(staff.getDateOfBirth())
                .email(staff.getEmail())
                .phoneNumber(staff.getPhoneNumber())
                .nationalIdNumber(staff.getNationalIdNumber())
                .accountLocked(staff.isAccountLocked())
                .enabled(staff.isEnabled())
                .build();
    }

    public Staff toStaff(StaffResponse staffResponse){
        return Staff.builder()
                .firstname(staffResponse.getFirstname())
                .lastname(staffResponse.getLastname())
                .dateOfBirth(staffResponse.getDateOfBirth())
                .email(staffResponse.getEmail())
                .phoneNumber(staffResponse.getPhoneNumber())
                .nationalIdNumber(staffResponse.getNationalIdNumber())
                .accountLocked(staffResponse.isAccountLocked())
                .enabled(staffResponse.isEnabled())
                .build();
    }

    public Staff toStaff(CreateStaffRequest request){
        return Staff.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .dateOfBirth(LocalDate.parse(request.getDateOfBirth()))
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .nationalIdNumber(request.getNationalIdNumber())
                .build();
    }
}
