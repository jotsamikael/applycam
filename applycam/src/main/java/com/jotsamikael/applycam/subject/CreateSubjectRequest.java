package com.jotsamikael.applycam.subject;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateSubjectRequest {

    private String name;
    private String description;
    private String code;
    

}
