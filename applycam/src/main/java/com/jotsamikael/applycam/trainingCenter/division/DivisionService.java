package com.jotsamikael.applycam.trainingCenter.division;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.jotsamikael.applycam.trainingCenter.division.Division.ALL_CAMEROON_DIVISIONS;

@Service
public class DivisionService {

    //get department by region
    public  List<Division> findByRegion(String region){

        return ALL_CAMEROON_DIVISIONS.stream().filter(d-> d.region().equalsIgnoreCase(region))
                .collect(Collectors.toList());
    }
}
