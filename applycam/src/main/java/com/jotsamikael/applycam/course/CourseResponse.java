package com.jotsamikael.applycam.course;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CourseResponse {

    private String name;

    private String code;

    private String description;
    
    

}
