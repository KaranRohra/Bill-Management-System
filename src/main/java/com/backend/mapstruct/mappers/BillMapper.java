package com.backend.mapstruct.mappers;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.backend.mapstruct.dto.BillDto;
import com.backend.model.Bill;

@Mapper(componentModel = "spring")
public interface BillMapper {
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateBillFromDto(BillDto billDto, @MappingTarget Bill bill);
}
