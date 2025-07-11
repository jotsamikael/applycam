package com.jotsamikael.applycam.activitySector;

import org.springframework.stereotype.Service;

@Service
public class SectorMapper {
	
	public ActivitySectorResponse mapToResponse(ActivitySector sector) {
        ActivitySectorResponse response = new ActivitySectorResponse();
        response.setId(sector.getId());
        response.setName(sector.getName());
        response.setCode(sector.getCode());
        response.setDescription(sector.getDescription());
        return response;
    }

}
