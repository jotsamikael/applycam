package com.jotsamikael.applycam.campus;

import org.springframework.stereotype.Service;

@Service
public class CampusMapper {

    public CampusResponse toCampusResponse(Campus campus){
        return CampusResponse.builder()
                .name(campus.getName())
                .capacity(campus.getCapacity())
                .town(campus.getTown())
                .quarter(campus.getQuarter())
                .xCoor(campus.getXCoor())
                .yCoor(campus.getYCoor())
                .trainingCenterCampus(campus.getTrainingCenter())
                .build();
    }
}
