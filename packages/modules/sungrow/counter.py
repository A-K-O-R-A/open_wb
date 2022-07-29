#!/usr/bin/env python3
from typing import Dict, Union

from dataclass_utils import dataclass_from_dict
from modules.common import modbus
from modules.common import simcount
from modules.common.component_state import CounterState
from modules.common.component_type import ComponentDescriptor
from modules.common.fault_state import ComponentInfo
from modules.common.modbus import ModbusDataType, Endian
from modules.common.store import get_counter_value_store
from modules.sungrow.config import SungrowCounterSetup


class SungrowCounter:
    def __init__(self,
                 device_id: int,
                 component_config: Union[Dict, SungrowCounterSetup],
                 tcp_client: modbus.ModbusTcpClient_) -> None:
        self.__device_id = device_id
        self.component_config = dataclass_from_dict(SungrowCounterSetup, component_config)
        self.__tcp_client = tcp_client
        self.__sim_count = simcount.SimCountFactory().get_sim_counter()()
        self.simulation = {}
        self.__store = get_counter_value_store(self.component_config.id)
        self.component_info = ComponentInfo.from_component_config(component_config)

    def update(self):
        unit = self.component_config.configuration.id
        with self.__tcp_client:
            if self.component_config.configuration.version == 1:
                power = self.__tcp_client.read_input_registers(5082, ModbusDataType.INT_32,
                                                               wordorder=Endian.Little, unit=unit)
                frequency = self.__tcp_client.read_input_registers(5035, ModbusDataType.UINT_16, unit=unit) / 10
                voltages = self.__tcp_client.read_input_registers(5018, [ModbusDataType.UINT_16] * 3,
                                                                  wordorder=Endian.Little, unit=unit)
                voltages = [voltage / 10 for voltage in voltages]
                # no valid data for powers per phase
                # powers = self.__tcp_client.read_input_registers(5084, [ModbusDataType.UINT_16] * 3,
                #                                                 wordorder=Endian.Little, unit=unit)
                # powers = [power / 10 for power in powers]
                # log.info("power: " + str(power) + " powers?: " + str(powers))
            else:
                power = self.__tcp_client.read_input_registers(13009, ModbusDataType.INT_32,
                                                               wordorder=Endian.Little, unit=unit) * -1
                frequency = self.__tcp_client.read_input_registers(5035, ModbusDataType.UINT_16, unit=unit) / 10
                voltages = self.__tcp_client.read_input_registers(5018, [ModbusDataType.UINT_16] * 3,
                                                                  wordorder=Endian.Little, unit=unit)
                voltages = [voltage / 10 for voltage in voltages]
                # no valid data for powers per phase
                # powers = self.__tcp_client.read_input_registers(5084, [ModbusDataType.INT_16] * 3,
                #                                                 wordorder=Endian.Little, unit=unit)
                # powers = [power / 10 for power in powers]
                # log.info("power: " + str(power) + " powers?: " + str(powers))

        topic_str = "openWB/set/system/device/{}/component/{}/".format(self.__device_id, self.component_config.id)
        imported, exported = self.__sim_count.sim_count(
            power,
            topic=topic_str,
            data=self.simulation,
            prefix="bezug"
        )

        counter_state = CounterState(
            imported=imported,
            exported=exported,
            power=power,
            voltages=voltages,
            frequency=frequency
        )
        self.__store.set(counter_state)


component_descriptor = ComponentDescriptor(configuration_factory=SungrowCounterSetup)
