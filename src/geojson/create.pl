#!/usr/bin/perl
# -I /usr/lib/perl/5.6.1
# -I/home/forecast/dnmi/lib/perl5/site_perl/5.6.1/IP27-irix
#
# Extract svg-icons for use in chart
#
use strict;
use JSON; # imports encode_json, decode_json, to_json and from_json.                          

sub Usage {                      
    print STDERR "
Usage: create.pl -f <default> -f <file1> -c <Norway> -f <file2> -c <Sweden> -o <output.json> 

extract geojson from multiple geojson-files
\n";                             
    exit 1;                      
}                                
#
my $default;               ## default json file
my $input;                 ## modifying json file
my $output="output.json";  ## output json file
my $feature;
my $cmd;
my %map={};
my @order;
my @args = @ARGV;
for my $arg (@args) {
    if ($arg =~ m/^\-(.+)/) {
	$cmd=$1;
    } elsif (defined $cmd) {
	if ($cmd eq "f") { # change input file
	    if (! defined $default) {
		$default=$arg;
	    } else {
		$input=$arg;
		push(@order,$input);
	    }
	} elsif ($cmd eq "c" && defined $input) {  # extract country from input file
	    if (! exists($map{$input})) { $map{$input}=[]; };
	    push(@{$map{$input}},$arg);
	} elsif ($cmd eq "o") {  # set output file
	    $output=$arg;
	}
    };
}
print "> Input $default\n";
my $json=readJsonFile($default);
my %written={};
## loop through input
for my $file (@order) { 
    ## get input file content
    print ">> Reading $file\n";
    my $str=readJsonFile($file);
    ## write features
    if (defined $map{$file}) {
	my @countries=@{$map{$file}};
	for my $country (@countries) {
	    print ">>> Processing $country\n";
	    if (! exists $written{$country}) {
		# find in $str
		my $trg;
		my $ft=getJsonAdmin($str,$country);
		# find in $json
		if (defined $ft) {
		    my $dt=getJsonAdmin($json,$country);
		    if (defined $dt) {
			print ">>>> Replacing ".($ft->{"properties"}->{"admin"})."\n";
			$dt->{"geometry"}=$ft->{"geometry"};
			$written{$country}=1;
		    }
		}
	    }
	}
    } else {
	print ">> No countries defined...\n";
    }
}
if (defined $json) {
    print "> Output $output\n";
    ## open output file
    open(FOH, '>', $output) or die $!;
    ## write header
    print FOH "export default ";
    print FOH encode_json $json;
    ## write tail
    print FOH "\n";
    ## close output file
    close (FOH);
} else {
    die "> No output $output";
}

sub getJsonAdmin{
    my $str=shift;
    my $trg=shift;
    my @fts=@{$str->{"features"}};
    if (@fts) {
	for my $ft (@fts) {
	    if ($ft->{"properties"}->{"admin"} eq $trg) {
		return $ft;
	    }
	}
    } else {
	print "    No features found...\n";
    }
    return;
}


sub readJsonFile {
    my $file=shift;
    my $str="";
    open(FIH, '<', $file) or die $!;
    while (my $line=<FIH>){
	$str=$str . $line;
    };
    close(FIH);
    ## look for features
    return (decode_json $str);
}
