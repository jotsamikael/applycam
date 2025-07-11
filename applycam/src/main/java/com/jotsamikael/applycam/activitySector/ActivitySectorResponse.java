package com.jotsamikael.applycam.activitySector;

import com.jotsamikael.applycam.campus.CampusResponse;
import com.jotsamikael.applycam.trainingCenter.TrainingCenter;

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
public class ActivitySectorResponse {
	
	private Long id;
    private String name;
    private String code;
    private String description;

}
