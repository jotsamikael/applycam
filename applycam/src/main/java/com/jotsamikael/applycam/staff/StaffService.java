package com.jotsamikael.applycam.staff;

import com.jotsamikael.applycam.common.PageResponse;
import com.jotsamikael.applycam.role.RoleRepository;
import com.jotsamikael.applycam.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StaffService {
    private final StaffRepository repository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final StaffMapper mapper;

    public StaffResponse findStaffByEmail(String email) {
        //get staff by email of throw exception
        Staff staff = repository.findByEmail(email).orElseThrow(()-> new EntityNotFoundException("No Staff Member found with email: "+email));
        return mapper.toStaffResponse(staff);
    }

    public PageResponse<StaffResponse> getAllStaff(int offset, int pageSize, String field, boolean order) {
        Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();

        Page<Staff> list = repository.getAllStaff(
                PageRequest.of(offset, pageSize, sort));

        List<StaffResponse> responses = list.stream().map(mapper::toStaffResponse).toList();
        return new PageResponse<>(
                responses,
                list.getNumber(),
                list.getSize(),
                list.getTotalElements(),
                list.getTotalPages(),
                list.isFirst(),
                list.isLast()
        );
    }

    public String createStaff(CreateStaffRequest request, Authentication connectedUser) {
        var userRole = roleRepository.findByName("STAFF")
                //todo - better exception handling
                .orElseThrow(() -> new IllegalStateException("ROLE STAFF was not initialized"));

        //get connected user and date time for audit purpose
        User user = ((User) connectedUser.getPrincipal());
        System.out.println("connected user is: "+user.getEmail());

        var staff = Staff.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .dateOfBirth(LocalDate.parse(request.getDateOfBirth()))
                .phoneNumber(request.getPhoneNumber())
                .nationalIdNumber(request.getNationalIdNumber())
                .positionName(request.getPositionName())
                .lastModifiedBy(user.getLastModifiedBy())
                .createdDate(LocalDateTime.now())
                .createdBy(user.getIdUser())
                .roles(List.of(userRole))
                .enabled(true)
                .accountLocked(false)
                .password(passwordEncoder.encode("11111111")) //by default when a staff member is created password is 11111111
                .build();
        System.out.println("date time is "+LocalDateTime.now());
               return repository.save(staff).getEmail();
    }

    public String updateProfile(String email, CreateStaffRequest request, Authentication connectedUser) {
        //start by getting the staff by email or throw an exception
        Staff staff = repository.findByEmail(email).orElseThrow(()-> new EntityNotFoundException("No staff with found email"+ email));

        //modify the staff object using the request data
        staff.setFirstname(request.getFirstname());
        staff.setLastname(request.getLastname());
        staff.setDateOfBirth(LocalDate.parse(request.getDateOfBirth()));
        staff.setPhoneNumber(request.getPhoneNumber());
        staff.setNationalIdNumber(request.getNationalIdNumber());
        staff.setPositionName(request.getPositionName());
        staff.setLastModifiedDate(LocalDateTime.now());


        //get connected user and date time for audit purpose
        User user = ((User) connectedUser.getPrincipal());
        staff.setLastModifiedBy(user.getIdUser());

        //save the modified candidate object
        repository.save(staff);

        //return
        return email;
    }


}
