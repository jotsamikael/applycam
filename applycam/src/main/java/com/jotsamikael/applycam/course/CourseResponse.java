package com.jotsamikael.applycam.course;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CourseResponse {

    private String name;

    private String code;

    private String description;
    
    private Double priceForDqp;
    
    

}
