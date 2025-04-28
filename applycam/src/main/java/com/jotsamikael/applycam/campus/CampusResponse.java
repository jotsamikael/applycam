package com.jotsamikael.applycam.campus;

import com.jotsamikael.applycam.trainingCenter.TrainingCenter;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CampusResponse {
    private String name;
    private int capacity; //max number of students it can support
    private String quarter;
    private String town;
    private double xCoor;
    private double yCoor;
    private TrainingCenter trainingCenterCampus;

}
