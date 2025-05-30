package com.jotsamikael.applycam.campus;

import com.jotsamikael.applycam.trainingCenter.TrainingCenter;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CreateCampusRequest {
    @NotEmpty(message = "name is mandatory")
    @NotNull(message = "name is mandatory")
    String name;

    @NotEmpty(message = "capacity is mandatory")
    @NotNull(message = "capacity is mandatory")
    int capacity; //max number of students it can support

    @NotEmpty(message = "Quarter is mandatory")
    @NotNull(message = "Quarter is mandatory")
    String quarter;

    @NotEmpty(message = "Town is mandatory")
    @NotNull(message = "Town is mandatory")
    String town;

    TrainingCenter trainingCenter;

    double xCoor;

    double yCoor;
}
