# Official Syllabus: Digital Circuits and Systems

- **Course Code**: `EAEPC305` (B.Tech ECE / ECAM Scheme, NSUT)
- **Course Name**: Digital Circuits and Systems
- **Course Structure**: `3-0-2` | **Credits**: 4
- **Pre-Requisite**: None

---

## Course Outcomes (COs)
- **CO1**: To get familiarized with number systems, codes, logic gates, logic families and Boolean algebra.
- **CO2**: To analyze and understand the design process associated with combinational circuits.
- **CO3**: To analyze and understand the design process associated with sequential circuits.
- **CO4**: To understand fundamental concepts of VHDL modeling for basic digital circuits.
- **CO5**: To develop basic understanding of programmable logic devices and converters.

---

## Detailed Unit Contents

### Unit 1: Number Systems, Boolean Algebra & Logic Families
Digital design representations: Truth tables, Boolean equations, Schematic diagrams. Codes and properties: Weighted vs non-weighted codes, BCD (8421), Gray code, Excess-3, Parity bits. Signed and unsigned binary numbers: 1's and 2's complement arithmetic and overflow. Boolean theorems: De Morgan's laws, SOP, POS, Canonical minterms and maxterms. Universal logic gates (NAND and NOR). Logic Families: TTL and CMOS characteristics (V_IH, V_IL, V_OH, V_OL, Propagation delay, Noise Margin, Fan-in, Fan-out, Power dissipation).

### Unit 2: Combinational Logic Design
Karnaugh Maps (K-Maps) up to 5 variables, Prime Implicants, Essential Prime Implicants, Don't Care conditions. Quine-McCluskey Method. Arithmetic circuits: Half/Full Adder, Subtractor, Look-Ahead Carry Adder, BCD Adder. Multiplexers (2:1, 4:1, 8:1, 16:1) and Boolean realization. Demultiplexers and Decoders (3:8, BCD to 7-Segment). Priority Encoders. Magnitude Comparators (IC 7485). Code converters.

### Unit 3: Sequential Logic Design & Finite State Machines
Latches vs Flip-Flops: SR, D, JK, T Flip-Flops, Race-around condition and Master-Slave JK Flip-Flop. Flip-Flop conversions. Shift Registers: SISO, SIPO, PISO, PIPO, Universal Shift Register. Counters: Asynchronous (Ripple) and Synchronous Modulo-N counter design, Ring and Johnson Counters. Finite State Machines: Mealy vs Moore models, State diagrams, State reduction, State assignment, Circuit synthesis.

### Unit 4: Hardware Description Language (VHDL)
VHDL Basic Structure: Entity declaration and Architecture body. Libraries and packages (IEEE, std_logic_1164). Data types: bit, std_logic, std_logic_vector. Modeling styles: Dataflow, Structural, and Behavioral modeling. Process statements, sensitivity lists. VHDL implementations of MUX, Full Adder, Decoders, Flip-Flops, and Counters.

### Unit 5: CMOS Gates, Data Converters & PLDs
Transistor-level CMOS schematics: Inverter, NAND, NOR, AOI/OAI compound gates. Digital-to-Analog Converters (DAC): Binary Weighted Resistor, R-2R Ladder. Analog-to-Digital Converters (ADC): Flash, SAR, Dual-Slope. Programmable Logic Devices: PAL, PLA, GAL, CPLD, and FPGA architectures (CLB, IOB, LUT).

---

## Suggested Books & References
1. M. Morris Mano and Michael D. Ciletti, *Digital Design*, 5th/6th Edition, Pearson.
2. R. P. Jain, *Modern Digital Electronics*, 4th Edition, McGraw-Hill.
3. J. Bhasker, *A VHDL Primer*, 3rd Edition, Prentice Hall.

---

## Examination Strategy & Weightage Analysis
- **Mid-Semester Weightage**: Unit 1 (40%), Unit 2 (40%), Unit 3 (20%). Focus on K-map minimization, full adder design using multiplexers, and flip-flop conversions.
- **End-Semester Weightage**: Unit 1 (15%), Unit 2 (20%), Unit 3 (25%), Unit 4 (20%), Unit 5 (20%). Modulo-N synchronous counter design, Mealy/Moore state diagram synthesis, and VHDL behavioral architectures.
